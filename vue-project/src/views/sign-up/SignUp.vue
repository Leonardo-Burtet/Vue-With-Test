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

const submit = () => {
  const {passwordRepeat, ...body} = formState
  axios.post('/api/v1/users', body )
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
  <h1>Sign Up</h1>
  
  <form @submit.prevent="submit">
    <div>
      <label for="username">Username</label>
      <input v-model="formState.username" type="text" id="username" placeholder="Username">
    </div>
    
    <div>
      <label for="email">E-mail</label>
      <input v-model="formState.email" type="text" id="email" placeholder="E-mail">
    </div>

    <div>
      <label for="password">Password</label>
      <input v-model="formState.password" type="password" id="password" placeholder="Password">
    </div>
    <div>
      <label for="passwordRepeat">Password Repeat</label>
      <input v-model="formState.passwordRepeat" type="password" id="passwordRepeat" placeholder="Password">
    </div>
    <button  :disabled="isDisabled">Sign Up</button>
  </form>
</template>
