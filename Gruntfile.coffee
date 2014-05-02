module.exports = (grunt) ->
    grunt.initConfig(
        pkg: grunt.file.readJSON('package.json')
        coffee:
            files:
                src: ['static/js/**/*.coffee']
                dest: 'static/js/script.js'
    )

    grunt.loadNpmTasks('grunt-contrib-coffee')

    grunt.registerTask('default', ['coffee'])
