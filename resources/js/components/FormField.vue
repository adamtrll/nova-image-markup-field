<template>
    <DefaultField
        ref="field"
        :field="currentField"
        :label-for="labelFor"
        :errors="errors"
        :show-help-text="!isReadonly && showHelpText"
        :full-width-content="fullWidthContent"
    >
        <template #field>
            <!-- Existing Image -->
            <div class="space-y-4">
                <div
                    v-if="hasValue && previewFile && files.length === 0"
                    class="grid grid-cols-4 gap-x-6 gap-y-2"
                >
                    <FilePreviewBlock
                        v-if="previewFile"
                        :file="previewFile"
                        :removable="shouldShowRemoveButton"
                        @removed="confirmRemoval"
                        :rounded="field.rounded"
                        :dusk="`${field.attribute}-delete-link`"
                    />
                </div>

                <!-- Upload Removal Modal -->
                <ConfirmUploadRemovalModal
                    :show="removeModalOpen"
                    @confirm="removeUploadedFile"
                    @close="closeRemoveModal"
                />

                <!-- DropZone -->
                <DropZone
                    v-if="shouldShowField"
                    :files="files"
                    @file-changed="handleFileChange"
                    @file-removed="file = null"
                    :rounded="field.rounded"
                    :accepted-types="field.acceptedTypes"
                    :disabled="file?.processing"
                    :dusk="`${field.attribute}-delete-link`"
                    :input-dusk="field.attribute"
                />
            </div>
            <!-- Image Editor -->
            <AppDesigner :bg-url="imageUrl" @save="saveEditedImage" />
        </template>
    </DefaultField>
</template>

<script>
import {
    DependentFormField,
    Errors,
    HandlesValidationErrors,
} from 'laravel-nova'
import InlineFormData from './InlineFormData'

import Vapor from 'laravel-vapor'
import AppDesigner from './designer/AppDesigner.vue'

function createFile(file) {
    return {
        name: file.name,
        extension: file.name.split('.').pop(),
        type: file.type,
        originalFile: file,
        vapor: false,
        processing: false,
        progress: 0,
    }
}

export default {
    emits: ['file-upload-started', 'file-upload-finished', 'file-deleted'],

    mixins: [HandlesValidationErrors, DependentFormField],

    components: { AppDesigner },

    inject: ['removeFile'],

    expose: ['beforeRemove'],

    data: () => ({
        previewFile: null,
        file: null,
        removeModalOpen: false,
        missing: false,
        deleted: false,
        uploadErrors: new Errors(),
        vaporFile: {
            key: '',
            uuid: '',
            filename: '',
            extension: '',
        },
        uploadProgress: 0,
        startedDrag: false,

        uploadModalShown: false,
    }),

    async mounted() {
        this.preparePreviewImage()

        this.field.fill = (formData) => {
            let attribute = this.fieldAttribute

            if (this.file && !this.isVaporField) {
                formData.append(
                    attribute,
                    this.file.originalFile,
                    this.file.name
                )
            }

            if (this.file && this.isVaporField) {
                formData.append(attribute, this.file.name)

                this.fillVaporFilePayload(formData, attribute)
            }
        }
    },

    methods: {
        async saveEditedImage(dataURL) {
            const response = await fetch(dataURL)
            const data = await response.blob()
            const file = new File([data], this.currentField.value, {
                type: data.type || defaultType,
            })

            // we are not updating actual input fields so we have to trigger form change manually
            const form = this.$refs.field.$el.closest('form')
            form.dispatchEvent(new Event('change'))

            Nova.$emit('image-markup-saved', {
                field: this.field.attribute,
                formId: this.formUniqueId,
            })

            this.handleFileChange([file])
        },

        preparePreviewImage() {
            if (this.hasValue && this.imageUrl) {
                this.fetchPreviewImage()
            }

            if (this.hasValue && !this.imageUrl) {
                this.previewFile = createFile({
                    name: this.currentField.value,
                    type: this.currentField.value.split('.').pop(),
                })
            }
        },

        async fetchPreviewImage() {
            let response = await fetch(this.imageUrl)
            let data = await response.blob()

            this.previewFile = createFile(
                new File([data], this.currentField.value, { type: data.type })
            )
        },

        handleFileChange(newFiles) {
            this.file = createFile(newFiles[0])

            if (this.isVaporField) {
                this.file.vapor = true
                this.uploadVaporFiles()
            }
        },

        uploadVaporFiles() {
            this.file.processing = true
            this.$emit('file-upload-started')

            Vapor.store(this.file.originalFile, {
                progress: (progress) => {
                    this.file.progress = Math.round(progress * 100)
                },
            })
                .then((response) => {
                    this.vaporFile.key = response.key
                    this.vaporFile.uuid = response.uuid
                    this.vaporFile.filename = this.file.name
                    this.vaporFile.extension = this.file.extension
                    this.file.processing = false
                    this.file.progress = 100
                    this.$emit('file-upload-finished')
                })
                .catch((error) => {
                    if (error.response.status === 403) {
                        Nova.error(
                            this.__(
                                'Sorry! You are not authorized to perform this action.'
                            )
                        )
                    }
                })
        },

        confirmRemoval() {
            this.removeModalOpen = true
        },

        closeRemoveModal() {
            this.removeModalOpen = false
        },

        beforeRemove() {
            this.removeUploadedFile()
        },

        async removeUploadedFile() {
            //   this.uploadErrors = new Errors()
            try {
                await this.removeFile(this.fieldAttribute)
                this.$emit('file-deleted')
                this.deleted = true
                this.file = null
                Nova.success(this.__('The file was deleted!'))
            } catch (error) {
                if (error.response?.status === 422) {
                    this.uploadErrors = new Errors(error.response.data.errors)
                }
            } finally {
                this.closeRemoveModal()
            }
        },

        fillVaporFilePayload(formData, attribute) {
            const vaporAttribute =
                formData instanceof InlineFormData
                    ? formData.slug(attribute)
                    : attribute

            const vaporFormData =
                formData instanceof InlineFormData
                    ? formData.formData
                    : formData

            vaporFormData.append(
                `vaporFile[${vaporAttribute}][key]`,
                this.vaporFile.key
            )
            vaporFormData.append(
                `vaporFile[${vaporAttribute}][uuid]`,
                this.vaporFile.uuid
            )
            vaporFormData.append(
                `vaporFile[${vaporAttribute}][filename]`,
                this.vaporFile.filename
            )
            vaporFormData.append(
                `vaporFile[${vaporAttribute}][extension]`,
                this.vaporFile.extension
            )
        },
    },

    computed: {
        files() {
            return this.file ? [this.file] : []
        },

        /**
         * Determine if the field has an upload error.
         */
        hasError() {
            return this.uploadErrors.has(this.fieldAttribute)
        },

        /**
         * Return the first error for the field.
         */
        firstError() {
            if (this.hasError) {
                return this.uploadErrors.first(this.fieldAttribute)
            }
        },

        /**
         * The ID attribute to use for the file field.
         */
        idAttr() {
            return this.labelFor
        },

        /**
         * The label attribute to use for the file field.
         */
        labelFor() {
            let name = this.resourceName

            if (this.relatedResourceName) {
                name += '-' + this.relatedResourceName
            }

            return `file-${name}-${this.fieldAttribute}`
        },

        /**
         * Determine whether the field has a value.
         */
        hasValue() {
            return (
                Boolean(this.field.value || this.imageUrl) &&
                !Boolean(this.deleted) &&
                !Boolean(this.missing)
            )
        },

        /**
         * Determine whether the field should show the loader component.
         */
        shouldShowLoader() {
            return !Boolean(this.deleted) && Boolean(this.imageUrl)
        },

        /**
         * Determine whether the file field input should be shown.
         */
        shouldShowField() {
            return Boolean(!this.currentlyIsReadonly)
        },

        /**
         * Determine whether the field should show the remove button.
         */
        shouldShowRemoveButton() {
            return Boolean(
                this.currentField.deletable && !this.currentlyIsReadonly
            )
        },

        /**
         * Return the preview or thumbnail URL for the field.
         */
        imageUrl() {
            return (
                this.currentField.previewUrl || this.currentField.thumbnailUrl
            )
        },

        /**
         * Determining if the field is a Vapor field.
         */
        isVaporField() {
            return this.currentField.component === 'vapor-file-field'
        },
    },
}
</script>
