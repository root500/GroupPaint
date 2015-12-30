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
            less: {
                tasks: 'less:dev',
                files: ['**/*.less']
            },
            options: {
                livereload: true
            }
        },
        less: {
            dev: {
                files: {
                    'client/static/css/style.css': 'client/static/less/style.less'
                }
            }
        },
        connect: {
            dev: {
                options: {
                    base: 'client',
                    port: 8080
                }
            }
        },
        open: {
            dev: {
                path: 'http://localhost:<%= connect.dev.options.port %>',
                app: 'Chrome'
            }
        }
    });

    for (var key in grunt.file.readJSON("package.json").devDependencies) {
        if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
    }

    grunt.registerTask('default', [
        'less:dev',
        'connect:dev',
        'open:dev',
        'watch'
    ]);
};