export default {
    methods: {
        copyText(text){
            navigator.clipboard.writeText(text)
                .then(() => {
                    this.$store.dispatch("addNotification", {
                        text: 'Текст скопирован в буфер обмена',
                        time: 3,
                        color: "success"
                    });
                })
                .catch(() => {
                    this.$store.dispatch("addNotification", {
                        text: 'Ваш браузер не поддерживает копирование',
                        time: 3,
                        color: "danger"
                    });
                });
        }
    }
}