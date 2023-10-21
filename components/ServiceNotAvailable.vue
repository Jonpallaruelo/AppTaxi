<template>
  <div class="backgroudTaxi d-flex align-center ml-15 animationMove" >

      <v-col cols="16" class="align-end flex-column float-left ml-15 textStyle">
        <h1 class="neonTextH1 neonText"> 101 </h1>
      <h2 class="neonText ">{{ $t('TextNotAvailable') }}</h2>

      </v-col>
    <v-col cols="12" class="ml-15 ">
      <v-img src="@/assets/taxiCentrado.png" class="" height="100vh" width="70vh" />
    </v-col>
  </div>
</template>

<style scope>
/* ... your styles ... */

  .animationMove {
    position: relative;
    animation: mymove 9s forwards;

  }

  @keyframes mymove {

    0% {
      left: 0px;
      opacity: 0.1;
    }
    50% {
        left: 17%; /* Mueve la imagen a la derecha en un 50% de la animación */
        opacity: 0.9;

    }
    100% {
      left: 17%; /* Vuelve a la posición original al final de la animación */
      opacity: 1;

    }

  }

  body{
    background-color: #000 !important;
  }

  .textStyle {
    font-family: "Helvetica Neue", sans-serif;
    text-align: center;
    text-transform: uppercase;
    font-weight: 400;
  }

  .neonText {
  color: #fff;
  text-shadow:
      0 0 7px #fff,
      0 0 10px #fff,
      0 0 21px #fff,
      0 0 42px #FF0000,
      0 0 82px #FF0000,
      0 0 92px #FF0000,
      0 0 102px #FF0000,
      0 0 151px #FF0000
}

.neonTextH1 {
  font-size: 4.2rem;
  animation: flicker 1.5s infinite alternate;
}

/* Flickering animation */
@keyframes flicker {

  0%, 18%, 22%, 25%, 53%, 57%, 100% {

      text-shadow:
      0 0 4px #fff,
      0 0 11px #fff,
      0 0 19px #fff,
      0 0 40px #FF0000,
      0 0 80px #FF0000,
      0 0 90px #FF0000,
      0 0 100px #FF0000,
      0 0 150px #FF0000,

  }

  20%, 24%, 55% {
      text-shadow: none;
  }
}

</style>
