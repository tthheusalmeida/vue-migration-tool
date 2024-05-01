<template>
  <div
    class="card"
    :style="backgroundColor(types[0])"
    @click="openPokemonDetails"
  >
    <div v-if="isThereData">
      <div
        class="card_id"
        :style="getBorderStyle(types[0])"
      >
        n°{{ id }}
      </div>

      <div
        class="card_img"
        :style="getBorderStyle(types[0])"
      >
        <img
          :src="img"
          :alt="name"
        >
      </div>

      <div class="card_name">
        {{ pokemonName }}
      </div>

      <div class="card_types">
        <div
            class="type"
            :style="getTypeStyle(type)"
            v-for="(type, index) in types" :key="index"
          >
            {{ type }}
        </div>
      </div>
    </div>

    <Loading v-else/>
  </div>
</template>

<script>
import Loading from '@/components/base/Loading.vue';
import { removeDashFromString } from '@/utils/formatter';
import { getCardBackgroundColor, getSolidColor } from '@/utils/color';
import { mapActions } from 'vuex';

export default {
  name: 'PokeCard',
  components: {
    Loading,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    types: {
      type: Array,
      required: true,
    },
    img: {
      type: String,
      required: true,
    },
  },
  computed: {
    isThereData() {
      return this.id && this.name && this.types && this.img;
    },
    pokemonName() {
      return removeDashFromString(this.name);
    },
  },
  methods: {
    ...mapActions('card', [
      'toggleDetails',
      'setPokemonDetails',
    ]),
    getTypeStyle(type) {
      return `
        color: var(--${type}-type);
        background: var(--background-${type}-type);
      `;
    },
    getBorderStyle(type) {
      return `border: 2px solid var(--background-${getSolidColor(type)}-type);`;
    },
    backgroundColor(type) {
      return getCardBackgroundColor(type);
    },
    openPokemonDetails() {
      this.setPokemonDetails({ id: this.id });
      this.toggleDetails();
    },
  },
};

</script>

<style lang="scss">
  .card {
    display: flex;
    flex-direction: column;
    align-content: center;

    font-size: 0.8rem;
    text-transform: capitalize;
    line-height: 1;
    padding: 8px;
    width: 150px;

    border-radius: 8px;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
    rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

    cursor: pointer;
    transition: transform 0.2s ease;

    &_img {
      $image-size: 130px;

      background: var(--card-gray);
      border-radius: 200%;
      min-width: $image-size;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        width: $image-size;
        min-width: $image-size;
        min-height: $image-size;
      }
    }

    &_id, &_name {
      text-align: center;
    }

    &_id {
      margin: 5px 42px 5px;
      padding: 3px 6px;
      border-radius: 8px;
      align-content: flex-start;
      background: var(--card-gray);
    }

    &_name {
      font-size: 16px;
      font-weight: bold;
      margin: 8px 0 6px 0;
    }

    &_types {
      display: flex;
      align-items: center;
      justify-content: space-around;

      .type {
        text-align: center;
        display: inline;
        border-radius: 5px;
        padding: 4px 8px;
      }
    }

    &:hover {
      transform: scale(1.1);
    }
  }
</style>