<script setup>
import { computed, reactive, ref } from 'vue';
import axios from 'axios';
const formState = reactive({
  username: '', 
  email: '',
  password: '',
  passwordRepeat: ''
})
// const username = ref('')
// const email = ref('')
// const password = ref('')
// const passwordRepeat = ref('')

const isDisabled = computed(() => {
  return (formState.password || formState.passwordRepeat) ? formState.password !== formState.passwordRepeat : true
})

const apiProgress = ref(false)
const successMessage = ref()

const submit = async () => {
  apiProgress.value = true
  const {passwordRepeat, ...body} = formState
  const response = await axios.post('/api/v1/users', body )
  successMessage.value = response.data.message
  // fetch(window.location.origin + '/api/v1/users', {
  //   method: 'POST',
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify(body)
  // })
}

</script>

<template>
  <div class="col-lg-6 offset-lg-3 col-md-8 offset-md-2">
    <form class="card" @submit.prevent="submit">
      <div class="card-header text-center">
        <h1>Sign Up</h1>
      </div>
  
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label" for="username">Username</label>
          <input class="form-control" v-model="formState.username" type="text" id="username" placeholder="Username">
        </div>
        
        <div class="mb-3">
          <label class="form-label" for="email">E-mail</label>
          <input class="form-control" v-model="formState.email" type="text" id="email" placeholder="E-mail">
        </div>
  
        <div class="mb-3">
          <label class="form-label" for="password">Password</label>
          <input class="form-control" v-model="formState.password" type="password" id="password" placeholder="Password">
        </div>
  
        <div class="mb-3">
          <label class="form-label" for="passwordRepeat">Password Repeat</label>
          <input class="form-control" v-model="formState.passwordRepeat" type="password" id="passwordRepeat" placeholder="Password">
        </div>
  
        <div class="text-center">
          <button class="btn btn-primary" :disabled="isDisabled || apiProgress">
            <span v-if="apiProgress" role="status" class="spinner-border spinner-border-sm"></span>
            Sign Up
          </button>
        </div>
      </div>
    </form>
    <div v-if="successMessage" class="alert alert-success">
      {{ successMessage }}
    </div>
  </div>
</template>

<style scoped>

</style>