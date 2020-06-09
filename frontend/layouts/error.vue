<template>
  <v-app>
    <div>
      <div class="site">
        <div class="sketch">
          <div class="bee-sketch red-alien"></div>
          <div class="bee-sketch blue-alien"></div>
        </div>

        <h1>
          <div v-if="error.statusCode === 404">
            404:
            <small>Página não encontrada</small>
          </div>
          <div v-else>
            {{ otherError }}
          </div>
          <br />

          <v-btn
            depressed
            x-large
            block
            nuxt
            :to="{ name: 'index' }"
            color="primary"
            class="mb-2"
          >
            Me tire daqui
          </v-btn>
        </h1>
      </div>
    </div>
  </v-app>
</template>

<script>
export default {
  layout: 'empty',
  props: {
    error: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      pageNotFound: '404 ',
      otherError: 'Oops, ocorreu um erro',
    }
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title,
    }
  },
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}

.site {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin: 0 auto;
  justify-content: center;
}

.sketch {
  position: relative;
  height: 400px;
  min-width: 400px;
  margin: 0;
  overflow: visible;
  order: 2;
}

.bee-sketch {
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
}

.red-alien {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png)
    no-repeat center center;
  opacity: 1;
  animation: red 3s linear infinite, opacityRed 5s linear alternate infinite;
}

.blue-alien {
  background: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png)
    no-repeat center center;
  opacity: 0;
  animation: blue 3s linear infinite, opacityBlue 5s linear alternate infinite;
}

@media only screen and (min-width: 780px) {
  .site {
    flex-direction: row;
    padding: 1em 3em 1em 0em;
  }

  h1 {
    text-align: right;
    order: 2;
    padding-bottom: 2em;
  }

  .sketch {
    order: 1;
  }
}

@keyframes blue {
  0% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png);
  }
  9.09% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-2.png);
  }
  27.27% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-3.png);
  }
  36.36% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-4.png);
  }
  45.45% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-5.png);
  }
  54.54% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-6.png);
  }
  63.63% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-7.png);
  }
  72.72% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-8.png);
  }
  81.81% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-9.png);
  }
  100% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/blue-1.png);
  }
}

@keyframes red {
  0% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png);
  }
  9.09% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-2.png);
  }
  27.27% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-3.png);
  }
  36.36% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-4.png);
  }
  45.45% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-5.png);
  }
  54.54% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-6.png);
  }
  63.63% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-7.png);
  }
  72.72% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-8.png);
  }
  81.81% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-9.png);
  }
  100% {
    background-image: url(https://s3-us-west-2.amazonaws.com/s.cdpn.io/198554/red-1.png);
  }
}

@keyframes opacityBlue {
  from {
    opacity: 0;
  }
  25% {
    opacity: 0;
  }
  75% {
    opacity: 1;
  }
  to {
    opacity: 1;
  }
}

@keyframes opacityRed {
  from {
    opacity: 1;
  }
  25% {
    opacity: 1;
  }
  75% {
    opacity: 0.3;
  }
  to {
    opacity: 0.3;
  }
}
</style>
