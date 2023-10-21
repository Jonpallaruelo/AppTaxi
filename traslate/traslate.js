import { createI18n } from 'vue-i18n'

export default createI18n({
  locale: 'es',
  allowComposition: true, // you need to specify that!
  messages: {
    es: {
      Restriction_7Seats: '7 plazas',
      Restriction_Pet: 'Mascotas',
      Restriction_Adapted: 'Adaptado',
      Restriction_Case: 'Maleta',
      Restriction_Electric: 'Coche eléctrico',
      Restriction_American_Express: 'American Express',
      Restriction_MiniVan: 'Monovolumen',
      TooManyRequest: 'Demasiados intentos, espere unos segundos para poder volver a intentarlo',
      TextBtnRouteAndPrice: 'Solicitar información',
      TextDialog: 'INFORMACIÓN DEL SERVICIO',
      NitaxText: 'Sistema de gestión de flotas de taxis',
      ERROR_OUTSIDE_METROPOLIS: 'No podemos calcular un precio fuera del área metropolitana',
      ERROR_PROXIMITY_ADDRESSES: 'Origen y destino demasiado próximos como para calcular un precio',
      ERROR_AIRPORT: 'No se puede solicitar taxis desde el aeropuerto',
      ERROR_STATION: 'No se puede solicitar taxis desde la estación',
      ErrorNotPrice:'No podemos calcular un precio para este servicio',
      Price: 'Precio',
      Time: 'Tiempo',
      Distance: 'Distancia',
      TextNotAvailable: 'Servicio no disponible'

    },
    en: {
      Restriction_7Seats: '7 places',
      Restriction_Pet: 'Pets',
      Restriction_Adapted: 'adapted',
      Restriction_Case: 'Case',
      Restriction_Electric: 'Electric car',
      Restriction_American_Express: 'American Express',
      Restriction_MiniVan: 'Minivan',
      TooManyRequest: 'Too many attempts, wait a few minutes to try again',
      TextBtnRouteAndPrice: 'Ask for information',
      TextDialog: 'SERVICE INFORMATION',
      NitaxText: 'Taxi fleet management system',
      ERROR_OUTSIDE_METROPOLIS: 'We cannot calculate a price outside the metropolitan area' ,
      ERROR_PROXIMITY_ADDRESSES: 'Origin and destination too close to calculate a price',
      ERROR_AIRPORT: 'You cannot order taxis from the airport',
      ERROR_STATION: 'You cannot request taxis from the station',
      ErrorNotPrice:'We cannot calculate a price for this service',
      Price: 'Price',
      Time: 'Time',
      Distance: 'Distance',
      TextNotAvailable: 'Service not available'

    },
    ca: {
      Restriction_7Seats: '7 places',
      Restriction_Pet: 'Mascota',
      Restriction_Adapted: 'Adaptat',
      Restriction_Case: 'Maleta',
      Restriction_Electric: 'Cotxe eléctric',
      Restriction_American_Express: 'American Express',
      Restriction_MiniVan: 'Monovolum',
      TooManyRequest: 'Massa intents, espereu uns segons per poder tornar a intentar-ho',
      TextBtnRouteAndPrice: 'Sol·licitar informació',
      TextDialog: 'INFORMACIÓ DEL SERVEI',
      NitaxText: 'Sistema de gestió de flotes de taxis',
      ERROR_OUTSIDE_METROPOLIS: 'No podem calcular un preu fora de làrea metropolitana' ,
      ERROR_PROXIMITY_ADDRESSES: 'Origen i destinació massa propers per calcular un preu',
      ERROR_AIRPORT: 'No es pot demanar taxis des de l´aeroport',
      ERROR_STATION: 'No podeu demanar taxis des de l´estació',
      ErrorNotPrice: 'No podem calcular un preu per a aquest servei',
      Price: 'Preu',
      Time: 'Temps',
      Distance: 'Distància',
      TextNotAvailable: 'Servei no disponible'
    }
  }
})
