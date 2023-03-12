<template>
  <div class="file-upload-input-container">
    <input
      id="file-upload"
      :key="uniqueKey"
      type="file"
      style="display: none"
      :accept="acceptedImagesExtensions"
      @change="onFileChange"
    >
    <label for="file-upload" class="lg:cursor-pointer">
      <div v-if="!getUploadedImage" class="flex items-center">
        <div class="image-upload-wrapper">
          <img
            src="~assets/images/ic-upload.png"
            :alt="$t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO')"
            :title="$t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO')"
            width="12"
            height="15"
          >
        </div>
        <div class="upload-text">{{ $t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO') }}</div>
      </div>
      <div v-else class="flex items-center">
        <img
          :src="getUploadedImage"
          :alt="$t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO')"
          :title="$t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO')"
          class="uploaded-image"
          width="40"
          height="40"
        >
        <div class="attached-file-details-container">
          <div class="file-name">

            {{ addedFileInfo.name ? addedFileInfo.name : savedImage ? $t('BOOKINGFLOW_PAGE.SAVED_PHOTO') : $t('BOOKINGFLOW_PAGE.UPLOAD_PHOTO') }}
          </div>
          <p v-if="addedFileInfo.type && addedFileInfo.size" class="details">
            {{ addedFileInfo.type }} • {{ formatBytes(addedFileInfo.size) }}
          </p>
        </div>
      </div>
    </label>
    <button
      v-if="!!uploadedImage"
      type="button"
      class="btn-close"
      aria-label="close"
      @click.prevent="deleteUploadedImage"
    >
      <close-svg width="8" height="8" />
    </button>
  </div>
</template>

<script>
const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// TODO: add a props for the uploaded image in case the component has been used in a place where we pass a default value for the image.
export default {
  props: {
    acceptedImagesExtensions: {
      type: String,
      default: "image/*",
    },
    savedImage: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      uniqueKey: new Date() + "",
      addedFileInfo: {},
      uploadedImage: "",
    };
  },
  computed: {
    getUploadedImage() {
      return this.uploadedImage || this.savedImage;
    },
  },
  methods: {
    async extractAddedFile(file) {
      try {
        const image = await toBase64(file);

        this.uploadedImage = image;
        this.$emit("setUploadedImage", image);
      } catch (err) {
        console.log({ err });
        return;
      }
    },
    onFileChange(event) {
      let files = event.target.files;
      if (!files || !files[0] || files[0].length == 0) return;
      // let temp_file_size_mb = ~~(files[0].size / 1024 / 1024);
      let temp_file_size_mb = files[0].size / 1024 / 1024;
      let maximumFileUpload = 5;
      if (temp_file_size_mb > maximumFileUpload) {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.MAXIMUM_UPLOAD', {fileSize:maximumFileUpload}),
        });
        return false;
      }
      //
      if (this.isImage(files[0].type)) {
        this.addedFileInfo = files[0];
        this.extractAddedFile(files[0]);
      } else {
        this.$showToast({
          type: "red",
          text: this.$t('BOOKINGFLOW_PAGE.THIS_FILE_TYPE_IS_NOT'),
        });
      }
    },
    isImage(fileType) {
      return fileType.indexOf("image") !== -1;
    },
    formatBytes(bytes, decimals = 2) {
      if (bytes === 0) return "0 Bytes";
      const k = 1024;
      const dm = decimals < 0 ? 0 : decimals;
      const sizes = ["BYTES", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

      const i = Math.floor(Math.log(bytes) / Math.log(k));

      return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + this.$t(`COMMON.SIZES.${sizes[i]}`);
    },
    deleteUploadedImage() {
      this.uniqueKey = new Date() + "";
      this.addedFileInfo = {};
      this.uploadedImage = "";
      this.$emit("deleteUploadedImage");
    },
  },
};
</script>

<style lang="scss">
@import "./BaseUpload.scss";
</style>
