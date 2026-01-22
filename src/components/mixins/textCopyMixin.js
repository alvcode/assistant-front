export default {
    methods: {
        copyText(text){
            navigator.clipboard.writeText(text)
                .then(() => {
                    this.$store.dispatch("addNotification", {
                        text: this.$t('app_text_copied'),
                        time: 3,
                        color: "success"
                    });
                })
                .catch(() => {
                    this.$store.dispatch("addNotification", {
                        text: this.$t('error_copying_not_supported'),
                        time: 3,
                        color: "danger"
                    });
                });
        }
    }
}