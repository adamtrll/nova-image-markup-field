const mix = require('laravel-mix')
const path = require('path')

require('./nova.mix')

mix.alias({
    '@': path.join(__dirname, 'resources/js'),
})
    .setPublicPath('dist')
    .ts('resources/js/field.ts', 'js')
    .vue({ version: 3 })
    .css('resources/css/field.css', 'css', [require('tailwindcss')])
    .nova('app/image-markup')
