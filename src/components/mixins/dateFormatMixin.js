export default {
    methods: {
        phpDateTimeToShortString(date) {
            if (date === '') return '';
            const month = [
                this.$t('app_month_jan'),
                this.$t('app_month_feb'),
                this.$t('app_month_mar'),
                this.$t('app_month_apr'),
                this.$t('app_month_may'),
                this.$t('app_month_jun'),
                this.$t('app_month_jul'),
                this.$t('app_month_aug'),
                this.$t('app_month_sep'),
                this.$t('app_month_oct'),
                this.$t('app_month_nov'),
                this.$t('app_month_dec')
            ];
            const dateObj = new Date(date);
            const day = dateObj.getDate().toString().padStart(2, '0');
            const hours = dateObj.getHours().toString().padStart(2, '0');
            const minutes = dateObj.getMinutes().toString().padStart(2, '0');
            const dateText = `${day} ${month[dateObj.getMonth()]} ${dateObj.getFullYear()}`;
            return `${dateText} - ${hours}:${minutes}`;
        }
    }
}