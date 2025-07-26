export default {
    methods: {
        getIconNameByFilename(filename) {
            const parts = filename.split('.');
            const ext = parts.length > 1 ? parts.pop().toLowerCase() : '';

            const imageExtensions = ['jpg', 'jpeg', 'png'];
            const wordExtensions = ['doc', 'docx', 'odt'];
            const excelExtensions = ['xls', 'xlsx'];
            const pdfExtensions = ['pdf'];
            const csvExtensions = ['csv'];
            const audioExtensions = ['mp3', 'acc', 'wma', 'flac', 'm4a', 'wav'];
            const videoExtensions = ['mp4', 'mkv', 'avi', 'mov', 'webm', 'm4v'];
            const codeExtensions = [
                'sql', 'php', 'js', 'go', 'html', 'css', 'json', 'yaml', 'vue', 'less', 'scss'
            ];
            const fileExtensions = ['txt', 'md'];

            if (imageExtensions.includes(ext)) {
                return 'file-image';
            } else if (wordExtensions.includes(ext)) {
                return 'file-word'
            } else if (excelExtensions.includes(ext)) {
                return 'file-excel'
            } else if (codeExtensions.includes(ext)) {
                return 'file-code'
            } else if (pdfExtensions.includes(ext)) {
                return 'file-pdf'
            } else if (csvExtensions.includes(ext)) {
                return 'file-csv'
            } else if (audioExtensions.includes(ext)) {
                return 'file-audio'
            } else if (videoExtensions.includes(ext)) {
                return 'file-video'
            } else if (fileExtensions.includes(ext)) {
                return 'file'
            } else {
                return 'question';
            }
        }
    }
}