<template>
  <splitpanes
    @resized="mapRedimention"
    class="default-theme"
    vertical
    style="height: 100vh"
    v-if="isConfigReady"
  >
    <pane :size="30" min-size="30">
      <v-container>
        <Address
          :map-value="store.adressData.descriptionOrigin"
          label="Origen"
          :color="store.isActiveBtnMapOrigin ? 'white' : 'primary'"
          @pick="whichBtnClicked"
        >
        </Address>

        <Address
          :map-value="store.adressData.descriptionDestiny"
          label="Destino"
          :color="store.isActiveBtnMapDestiny ? 'white' : 'secondary'"
          @pick="whichBtnClicked"
        >
        </Address>

        <v-text-field
          type="datetime-local"
          :model-value="pickedDate"
          @update:model-value="pickedateEvent"
          variant="solo"
          @click:append-inner="showCalendar"
        ></v-text-field>

        <v-card
          class="mb-4"
          title="Opciones Especiales:"
          :elevation="2"
          rounded
          color="black-lighten-3"
        >
          <v-card-text>
            <v-col
              v-for="item in configApp.restrictionsAndExtrasList"
              class="d-inline-block"
              :key="item.description"
              cols="2"
              md="5"
            >
              <v-checkbox
                density
                :label="$t(item.description)"
                @change="
                  (event) => {
                    item.active = event.target.checked;
                    store.desactiveBtnsMap();
                  }
                "
              ></v-checkbox>
            </v-col>
          </v-card-text>
        </v-card>

        <v-btn
          block
          :disabled="
            !(
              store.adressData.latitudeOrigin != 0 &&
              store.adressData.latitudeDestiny != 0
            )
          "
          @click="buttonSolitInfoApi"
          color="primary"
        >
          {{ $t("TextBtnRouteAndPrice") }}
        </v-btn>

        <v-row class="justify-center align-center pt-15">
          <v-col cols="8">
            <v-img src="@/assets/logo_nitax_sidus.png" />
            <h3 class="text-center">{{$t('NitaxText')}}</h3>
          </v-col>
        </v-row>
        <v-row class="justify-center align-center" >
          <v-col cols="2">
            <h4 class="text-blue" >V {{ version }}</h4>
          </v-col>
        </v-row>
      </v-container>
    </pane>
    <pane :size="70" min-size="30">
      <l-map
        ref="map"
        zoom="12.5"
        :center="[managerApp.defaultLatitude, managerApp.defaultLongitude]"
        @ready="optionsMapt"
        @click="clickMap"
        @mouseover="cursorMouseStyle"
      >
        <l-tile-layer
          :url="url"
          layer-type="base"
          name="OpenStreetMap"
        ></l-tile-layer>
        <l-marker
          v-if="store.adressData.latitudeOrigin > 0"
          :lat-lng="[
            store.adressData.latitudeOrigin,
            store.adressData.longitudeOrigin,
          ]"
        >
          <l-icon
            :iconUrl="`${iconOptions.iconUrl}blue.png`"
            :iconSize="iconOptions.iconSize"
            :iconAnchor="iconOptions.iconAnchor"
          ></l-icon>
          <l-tooltip>
            <p>{{ store.adressData.descriptionOrigin }}</p>
          </l-tooltip>
        </l-marker>

        <l-marker
          v-if="store.adressData.latitudeDestiny > 0"
          :lat-lng="[
            store.adressData.latitudeDestiny,
            store.adressData.longitudeDestiny,
          ]"
        >
          <l-icon
            :iconUrl="`${iconOptions.iconUrl}red.png`"
            :iconSize="iconOptions.iconSize"
            :iconAnchor="iconOptions.iconAnchor"
          ></l-icon>
          <l-tooltip>
            <p>{{ store.adressData.descriptionDestiny }}</p>
          </l-tooltip>
        </l-marker>
        <l-polyline :visible="true" :lat-lngs="polylineLatLong" color="blue" />
      </l-map>
    </pane >
      <div class="text-center">
        <v-dialog v-model="dialog" max-width="600" >
          <v-card>
            <v-card-text class="text-center">
              <h1 :color="primary" class="text-center">
                {{ $t('TextDialog') }}
              </h1>
            <v-img src="@/assets/logo_nitax.png" height="60" />
              <v-list lines="linea">
                <div v-if="routeAndPriceResponse._message == 'Success'">
                  <v-list-item  v-if="routeAndPriceResponse._totalPrice > 0">
                    {{ $t('Price') }}:
                    {{
                      routeAndPriceResponse._totalPrice.toLocaleString("es-ES", {
                        style: "currency",
                        currency: "EUR",
                      })
                    }}</v-list-item
                  >
                  <v-list-item v-else>{{ $t('ErrorNotPrice') }}</v-list-item>
                  <v-list-item v-if="routeAndPriceResponse._distance > 0">
                    {{ $t('Distance') }}:
                    {{ routeAndPriceResponse._distance.toLocaleString("es-ES") }} km</v-list-item
                  >
                  <v-list-item v-if="routeAndPriceResponse._time > 0">
                    {{ $t('Time') }}:
                    {{ Math.round(routeAndPriceResponse._time / 60) }} min</v-list-item
                  >
                </div>
                <v-list-item v-else>
                    {{ $t(routeAndPriceResponse._message)}}</v-list-item
                  >
              </v-list>
            </v-card-text>
          </v-card>
        </v-dialog>
      </div>
  </splitpanes>
  <ServiceNotAvailable v-else />
  <v-snackbar
    :model-value="store.showNotification"
    color="error"
    timeout="6000"
    multi-line
  >
    {{ $t("TooManyRequest") }}
  </v-snackbar>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import "leaflet/dist/leaflet.css";
import {
  LMap,
  LTileLayer,
  LMarker,
  LIcon,
  LPolyline,
  LTooltip
} from "@vue-leaflet/vue-leaflet";
import { Icon } from "leaflet";
import Address from "./Address.vue";
import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";
import ManagerApp from "@/manager/ManagerApp";
import getAllData from "@/service/getAllData";
import { useAppStore } from "@/store/app";
import { version } from "../../package.json";
import ServiceNotAvailable from "./ServiceNotAvailable.vue";
// Variables
const map = ref();
const store = useAppStore(); // Utiliza tu almacén Pinia
const url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
let labelButtonActive = ""


const router = useRoute(); //usamos el router para controlar el parametro
const isConfigReady = ref(false);
let dialog = ref(false);
var optionsMaps = null;
var configApp = ref([]);
let polylineLatLong = ref([]);
let managerApp = new ManagerApp();
const central = router.query.fleet;

const iconOptions = {
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
};

watch(store.adressData, (value) => {

  map.value.$el.classList.remove('custom-button'); //añadimos la clase al elemento div que contiene el mapa
  let coordinates = [];

  if (store.adressData.latitudeOrigin != 0 && store.adressData.latitudeDestiny != 0) {
    getAllData(`/GetRoute/${value.latitudeOrigin}/${value.longitudeOrigin}/${value.latitudeDestiny}/${value.longitudeDestiny}/${central}`)
    .then(function (data) {
      // Expresión regular para buscar las coordenadas
      const pattern = /(-?\d+\.\d+) (-?\d+\.\d+)/g;
      const matches = [...data.matchAll(pattern)];

      // Encuentro la latitude y la longitude a traves de las regex o expresion regular , se almacenan en matches, la latitud esta en la posicion 2 y la longitud en la 1
      polylineLatLong.value = [matches.map((o) => [o[2], o[1]])];
      optionsMaps.fitBounds(polylineLatLong.value);
    });

  }else if(store.adressData.latitudeOrigin == 0 && store.adressData.latitudeDestiny == 0){
    polylineLatLong.value = [];
    return
  } else {

    polylineLatLong.value = [];

    store.adressData.latitudeOrigin != 0
        ? (coordinates = [value.latitudeOrigin, value.longitudeOrigin])
        : (coordinates = [value.latitudeDestiny, value.longitudeDestiny]);

      optionsMaps.flyTo(coordinates, 16, {
        smoothZoom: true, // Habilita el zoom suave
        smoothZoomOptions: {
          maxSpeed: 0.2, // Velocidad máxima de zoom suave
        }
      })
    }
});

const cursorMouseStyle = (() => {
   store.isActiveBtnMapOrigin || store.isActiveBtnMapDestiny ? map.value.$el.classList.add('custom-button') : map.value.$el.classList.remove('custom-button');
});

onMounted(() => {
  //const mapInstance = document.querySelector(".leaflet-container")._leaflet_map; // Obtiene la instancia del mapa

  // Accede a las opciones del mapa
  //const options = mapInstance.options;
    getAllData(`/GetConfiguration/${router.query.fleet}`)
    .then(function (data) {
      if (!data.message) {

        managerApp.defaultLatitude = data.defaultLatitude;
        managerApp.defaultLongitude = data.defaultLongitude;
        managerApp.provinceCode = data.provinceCode;
        managerApp.central = central;
        // agrego un nuevo campo para saber si active o desactivo las restricciones y evitar nulos.
        data.restrictionsAndExtrasList.forEach(element => element.active = false)

        configApp.value = data;

        isConfigReady.value = true;
      }
    })
});

// redimensionar mapa
const optionsMapt = (e) => {
  optionsMaps = e;
};

const mapRedimention = () => {
  optionsMaps._onResize();

};

const whichBtnClicked = (infoMarker) => {
    labelButtonActive = infoMarker
}
//variable que guarda el numero valor de cada restricción

//formateo de fechas
const formatDay = (updateDate) => {
  let year = updateDate.getFullYear();
  let month = String(updateDate.getMonth() + 1).padStart(2, "0");
  let day = String(updateDate.getDate()).padStart(2, "0");
  let hours = String(updateDate.getHours()).padStart(2, "0");
  let minutes = String(updateDate.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};
let pickedDate = ref(formatDay(new Date())); //propiedad para cargar la fecha actual en el label del calendario

var routeAndPriceResponse = ref({
  _distance: "",
  _message: "",
  _time: "",
  _totalPrice: "",
});

//funcion que detecta las cordenadas en el mapa y llama a la api, en el caso de que el mapEditionmode sea true
const clickMap = async (e) => {
  if (!store.isActiveBtnMapDestiny && !store.isActiveBtnMapOrigin) return;

  getAllData(
    `/GetStreetFromGPS/${e.latlng.lat}/${e.latlng.lng}/${central}`
  ).then(function (data) {
    if (labelButtonActive == "Origen") {
      store.setNewOriginAdressData({ latitudeOrigin: data.latitude, longitudeOrigin: data.longitude, descriptionOrigin: `${data.description} ${data.number}`})
    } else {
      store.setNewDestinyAdressData({ latitudeDestiny: data.latitude, longitudeDestiny: data.longitude, descriptionDestiny: `${data.description} ${data.number}`});
    }

  })
    store.desactiveBtnsMap(labelButtonActive);
    map.value.$el.classList.remove('custom-button');
};
// funcion para solicitar la llamada a la api para ver el precio

const buttonSolitInfoApi = () => {

  store.desactiveBtnsMap(labelButtonActive);

  const arrayDateTime = pickedDate.value.split("-");
  const [year, month, dayHour] = arrayDateTime;
  const [day, time] = dayHour.split("T");
  const [hour, minute] = time.split(":");

// Usamos reduce con una función de flecha para sumar las checkBox activos

const supplement = configApp.value.restrictionsAndExtrasList.reduce((acumulador, item) => { return item.active ? acumulador + item.extraValue : acumulador;}, 0);

  getAllData(
    `/GetRouteInfoAndPrice/${store.adressData.latitudeOrigin}/${
      store.adressData.longitudeOrigin
    }/${store.adressData.latitudeDestiny}/${
      store.adressData.longitudeDestiny
    }/${managerApp.central}${ supplement > 0 ? "?supplements=" + supplement + "&" : "?" }year=${year}&month=${month}&day=${day}&hour=${hour}&minute=${minute}`).then(function (data) {
      routeAndPriceResponse.value = data;
      dialog.value = true;
  });
};


const pickedateEvent = (eventDate) => {
  pickedDate.value = formatDay(new Date(eventDate));
};

if (typeof window !== "undefined") {
  delete Icon.Default.prototype._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl: import("leaflet/dist/images/marker-icon-2x.png"),
    iconUrl: import("leaflet/dist/images/marker-icon.png"),
    shadowUrl: import("leaflet/dist/images/marker-shadow.png"),
  });
}
</script>

<style>
.custom-button {
  cursor: crosshair;
  /* Cambia el cursor al icono de una mano */
  /* Otros estilos para el botón */
}

.v-label {
  font-weight: bold;
  font-size: 18px;
}

</style>
