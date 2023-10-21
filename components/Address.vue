<template>
  <div class="cordenada">
    <!-- <p>Origen: {{ message }}</p>
      <input  v-model="message" placeholder="Introduce tu origen" /> -->

    <v-combobox
      ref="comboboxRef"
      :loading="isLoading"
      no-filter
      class="rounded-ts rounded-bs"
      :items="items"
      item-value="coordinates"
      item-title="text"
      :label="label"
      variant="solo"
      :model-value="inputValue"
      @update:model-value="searchText"
    ></v-combobox>

    <v-btn
      @click="actionMap"
      height="55"
      min-width="80"
      :color="color"
      size="x-large"
      text
    >
      <v-icon left icon="mdi-google-maps"></v-icon>
    </v-btn>
  </div>
</template>

<script setup>
import { defineProps } from "vue";
import { ref } from "vue";
import { watch } from "vue";
import getAllData from "@/service/getAllData";

import ManagerApp from "@/manager/ManagerApp";
import { useAppStore } from "@/store/app";

//referenciamos el combobox para poder forzar el menu desplegable
const comboboxRef = ref(null);
let managerApp = new ManagerApp()
const store = useAppStore();

const props = defineProps({
  label: String,
  color: String,
  mapValue: String,
  picking: Boolean,
});

//objeto para relaizar el mapeo en el input

let isLoading = ref(false);
const items = ref([]);

let temporizador = null;
const inputValue = ref(props.mapValue);


watch(
  () => props.mapValue,
  () => {
    //cuando cambia el  valor del map. le asginamos al texto del input
    inputValue.value = props.mapValue;
    store.desactiveBtnsMap(props.label);
    items.value = [];
  }
);


//funcion para controlar la escritura con un temporizador cada tres segundos

const searchText = (val) => {
  isLoading.value = false;
  inputValue.value = val;
  items.value = [];

  store.desactiveBtnsMap(props.label);

  if (!val) {
    props.label == "Origen" ? store.clearOriginAdressData() : store.clearDestinyAdressData();
    return;
  }

  if (val.coordinates) {
    const street = val.text.substr(0, (val.text.indexOf("(")) - 3);
    (props.label == "Origen") ? (store.setNewOriginAdressData({latitudeOrigin:val.coordinates[0],longitudeOrigin:val.coordinates[1], descriptionOrigin: street})) : (store.setNewDestinyAdressData({latitudeDestiny:val.coordinates[0],longitudeDestiny:val.coordinates[1], descriptionDestiny: street}))
    return;
  }

  //avisamos de que el mapa tiene que borrar el marcador

  //emit("modificCursor");

  if (temporizador != null) {
    clearTimeout(temporizador);
    temporizador = null;
  }

  //if (val === props.modelValue || val == undefined) { return }

  if (val.length >= 3) {
    isLoading.value = true;

    temporizador = setTimeout(() => {
    getAllData(`/GetStreetFromChars/${val}/${managerApp.provinceCode}/${managerApp.central}`)
      .then(function (data) {
        if (inputValue.value.length > 2) {
          items.value = data.map((o) => ({
            text: `${o.description} ${o.number} ${o.city}`,
            coordinates: [o.latitude, o.longitude],
          }));

          comboboxRef.value.menu = true;

          isLoading.value = false;
        }
      });
    }, 1000);
  } else {

    props.label == "Origen" ? store.clearOriginAdressData() : store.clearDestinyAdressData();

  }
};

//creamos el emitt

const emit = defineEmits(["pick"]);

const actionMap = () => {
  emit('pick', props.label)
  store.activeBtnsMap(props.label)
};
</script>

<style>
.cordenada {
  display: flex;
}

.b-separator {
  margin-left: 10px;
  margin-top: 10px;
}

.combobox {
  width: 350px;
}
</style>
