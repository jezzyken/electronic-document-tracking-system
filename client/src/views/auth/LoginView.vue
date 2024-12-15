<template>
  <v-container fill-height fluid class="login-container">
    <div class="animated-bg"></div>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="login-card">
          <div class="card-header">
            <h1 class="text-h4 font-weight-bold mb-2">Welcome Back</h1>
            <p class="text-subtitle-1 grey--text">Sign in to your account</p>
          </div>

          <v-card-text>
            <v-form @submit.prevent="handleSubmit" ref="form">
              <v-text-field
                v-model="form.email"
                label="Email"
                outlined
                rounded
                dense
                :rules="[rules.required, rules.email]"
                class="input-field"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-email</v-icon>
                </template>
              </v-text-field>

              <v-text-field
                v-model="form.password"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                outlined
                rounded
                dense
                :rules="[rules.required]"
                class="input-field"
              >
                <template v-slot:prepend>
                  <v-icon color="primary">mdi-lock</v-icon>
                </template>
                <template v-slot:append>
                  <v-icon @click="showPassword = !showPassword">
                    {{ showPassword ? "mdi-eye" : "mdi-eye-off" }}
                  </v-icon>
                </template>
              </v-text-field>

              <v-btn
                block
                color="primary"
                height="44"
                elevation="2"
                :loading="loading"
                @click="handleSubmit"
                class="login-btn"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "LoginView",

  data() {
    return {
      form: {
        email: "",
        password: "",
      },
      showPassword: false,
      emailError: "",
      passwordError: "",
      rules: {
        required: (v) => !!v || "This field is required",
        email: (v) =>
          /.+@.+\..+/.test(v) || "Please enter a valid email address",
      },
      socialLogins: [
        { provider: "google", icon: "mdi-google", color: "red" },
        { provider: "facebook", icon: "mdi-facebook", color: "blue" },
        { provider: "twitter", icon: "mdi-twitter", color: "light-blue" },
      ],
    };
  },

  computed: {
    ...mapState("auth", ["loading", "error"]),
  },

  methods: {
    ...mapActions("auth", ["login", "socialLogin"]),

    async handleSubmit() {
      if (this.$refs.form.validate()) {
        try {
          await this.login(this.form);

          const userData = JSON.parse(localStorage.getItem("user"));

          if (userData?.role?.name === "Staff") {
            this.$router.push("/admin/documents");
          } 
        } catch (error) {
          if (error.response?.data?.field === "email") {
            this.emailError = error.response.data.message;
          } else if (error.response?.data?.field === "password") {
            this.passwordError = error.response.data.message;
          } else {
            this.error =
              error.response?.data?.message ||
              "Login failed. Please try again.";
          }
        }
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  background: linear-gradient(to right, #f5f7fa, #c3cfe2);
  min-height: 100vh;
}

.login-card {
  border-radius: 16px;
  box-shadow: 0 4px 25px 0 rgba(0, 0, 0, 0.1);
}

.custom-field {
  border-radius: 12px;
}

.custom-field >>> .v-input__slot {
  min-height: 44px;
}

.custom-field >>> .v-text-field__details {
  padding-left: 12px;
}

.v-alert {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }
  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }
  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }
  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}

.v-btn:not(.v-btn--icon) {
  transition: transform 0.2s ease-in-out;
}

.v-btn:not(.v-btn--icon):hover {
  transform: translateY(-2px);
}

.welcome-msg {
  color: #a52a2a;
}

.login-container {
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.animated-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, #f5f7fa, #c3cfe2, #a52a2a);
  background-size: 400% 400%;
  animation: gradient 15s ease infinite;
  z-index: 0;
}

.login-card {
  position: relative;
  z-index: 1;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.9);
  padding: 2rem;
  transition: transform 0.3s ease;
}

.login-card:hover {
  transform: translateY(-5px);
}

.card-header {
  text-align: center;
  padding: 1rem 0 2rem;
}

.input-field {
  margin-bottom: 1.5rem;
}

.login-btn {
  text-transform: none;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  border-radius: 10px;
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

@keyframes gradient {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}
</style>
