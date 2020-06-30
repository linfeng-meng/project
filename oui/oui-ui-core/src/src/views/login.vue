<template>
  <v-app>
    <v-app-bar id="app-bar" absolute app color="transparent" flat height="75">
      <img :src="$t('logosrc')" height="50" alt />
      <v-spacer />
      <v-menu offset-y transition="scale-transition">
        <template v-slot:activator="{ on }">
          <v-btn text v-on="on">
            <v-icon left>mdi-translate</v-icon>
            <span style="margin-right:8px">{{ $t('Language') }}</span>
            <v-icon left>mdi-menu-down</v-icon>
          </v-btn>
        </template>
        <v-list dense>
          <v-list-item-group v-model="lang" color="success">
            <v-list-item @click="onLangCommand('en')">
              <v-list-item-title>English</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onLangCommand('zh-CN')">
              <v-list-item-title>中文</v-list-item-title>
            </v-list-item>
            <v-list-item @click="onLangCommand('auto')">
              <v-list-item-title>{{ $t('Automatic') }}</v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-menu>
    </v-app-bar>
    <div class="login-wrap">
      <v-card width="400px">
        <v-card-title>{{$t('Authorization Required')}}</v-card-title>
        <v-form ref="login" v-model="valid">
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  dense
                  v-model="form.username"
                  :placeholder="$t('Please input username')"
                  :label="$t('Username')"
                  :rules="rules.username"
                  @keyup.enter.native="handleLogin"
                  required
                >
                  <v-icon slot="prepend" color>mdi-account</v-icon>
                </v-text-field>
              </v-list-item-content>
            </v-list-item>
            <v-list-item>
              <v-list-item-content>
                <v-text-field
                  dense
                  v-model="form.password"
                  :label="$t('Password')"
                  @keyup.enter.native="handleLogin"
                  required
                >
                  <v-icon slot="prepend" color>mdi-lock-open-outline</v-icon>
                </v-text-field>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-form>
        <v-alert dense type="error" v-if="warning">{{$t('Wrong username or password given!')}}</v-alert>
        <v-card-actions>
          <v-spacer />
          <v-btn color="success" dark @click="handleLogin">{{ $t('Login') }}</v-btn>
          <v-btn color="warning" dark @click="reset">{{ $t('Reset') }}</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-app>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      lang: 0,
      form: {
        username: "",
        password: ""
      },
      rules: {
        username: [v => !!v || this.$t("This field is required")]
      },
      valid: true,
      warning: false
    };
  },
  methods: {
    onLangCommand(cmd) {
      this.$ubus.call("oui.ui", "lang", { lang: cmd }).then(({ lang }) => {
        this.$store.commit("setLang", lang);
        if (lang === "auto") lang = navigator.language;
        this.$i18n.locale = lang;
      });
    },
    handleLogin() {
      if (this.$refs["login"].validate()) {
        this.$session
          .login(this.form.username, this.form.password)
          .then(valid => {
            if (valid) {
              this.$session.updateACLs().then(() => {
                this.$router.push("/");
              });
              return;
            }

            this.warning = true;
          });
      }
    },
    reset() {
      this.$refs["login"].reset();
      this.warning = false;
    }
  },
  computed: {},
  created() {
    switch (this.$store.state.lang) {
      case "en":
        this.lang = 0;
        return;
      case "zh-CN":
        this.lang = 1;
        return;
      case "auto":
        this.lang = 2;
        return;
    }
    this.$session.logout();
  }
};
</script>

<style lang="scss">
.v-toolbar__content {
  background-color: rgba(255, 255, 255, 0.5) !important;
}
.login-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url(/icons/background.jpg) no-repeat 50% 50%;
  background-size: cover;
  .v-card {
    padding: 10px;
  }
  .v-card__title {
    font-size: 1.25rem;
  }
  .v-icon {
    font-size: 24px;
  }
}
</style>
