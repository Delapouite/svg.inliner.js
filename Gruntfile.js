module.exports = function(grunt) {

	grunt.initConfig({
		umd: {
			all: {
				src: 'svg.inliner.js',
				objectToExport: 'SVGInliner', // internal object that will be exported
				globalAlias: 'SVGInliner' // changes the name of the global variable
			}
		},
		connect: {
			server: {
				options: {
					port: 4200,
					keepalive: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-umd');
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.registerTask('default', ['umd']);
};