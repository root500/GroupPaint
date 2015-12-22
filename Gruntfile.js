module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            scripts: {
                files: ['**/*.js']
            },
            html: {
                files: ['**/*.html']
            },
            options: {
                liveload: true
            }
        },
        connect: {
            options: {
                port: 8080
            }
        },
        open: {
            path: 'http://localhost:<%= connect.options.port %>',
            app: 'Chrome'
        }
    });

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }

    grunt.registerTask('default', [
        'watch',
        'connect',
        'open'
    ]);
};