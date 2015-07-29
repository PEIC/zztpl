'use strict';
module.exports=function(grunt){
	require('load-grunt-tasks')(grunt);

	require('time-grunt')(grunt);

	var config={
		app:'app',            //l
		dist:'build',
		port:'8200',
		lrPort:35730,
		defaultBrowser:'Google Chrome'
	}
    var lrPort = config.lrPort;
    var lrSnippet = require('connect-livereload')({ port: lrPort });
    var lrMiddleware = function(connect, options) {
        return [
            lrSnippet,
            connect.static(options.base[0]),
            connect.directory(options.base[0])
        ];
    };

	grunt.initConfig({
		config:config,
		copy:{
			build:{
				files:[
					{cwd: '<%= config.app %>/',expand: true,src:'images/**',dest:'<%= config.dist %>/'},
					{cwd: '<%= config.app %>/',expand: true,src:'js/**',dest:'<%= config.dist %>/'}
				]
			}
		},
		imagemin:{
			images:{                
			      files: [{
			        expand: true,                  
			        cwd: '<%= config.app %>/',                   
			        src: ['images/**/*.{png,jpg,gif}'],    
			        dest: '<%= config.dist %>/'   
			      }]
			    }
		},
		clean:{
			images:['<%= config.dist %>/images'],
			build:['<%= config.dist %>']
		},
		less:{
			main:{
				options:{
					compress:true
				},
				files:{
					'<%= config.dist %>/css/style.css':'<%= config.app %>/less/style.less',
					'<%= config.app %>/css/style.css':'<%= config.app %>/less/style.less'
				}
			}
		},
		watch:{
			includes:{
				files:['<%= config.app %>/*','<%= config.app %>/common/*'],
				options: {
                    livereload: lrPort
                },
				tasks:['includes']
			},
			less:{
				files:['<%= config.app %>/less/**'],
				options: {
                    livereload: lrPort
                },
				tasks:['less']
			},
			files:{
				files:['<%= config.app %>/images/**','<%= config.app %>/js/**'],
				tasks:['copy:build']
			}
		},
		includes: {
		  files: {
		    src: ['**.html'], 
		    dest: '<%= config.dist %>/',
		    flatten: true,
		    cwd: '<%= config.app %>',
		    options: {
		      silent: true,
         	 includePath: '<%= config.app %>/common',
		      banner: ''
		    }
		  }
		},
		connect: {
		      options: {
		        port: config.port,
		        base: '<%= config.dist %>'
		      },
			    livereload: {
	                options: {
	                    middleware: lrMiddleware
	                }
	            }
		},
		open : {
		    dev : {
		      path: 'http://127.0.0.1:'+ config.port,
		      app:config.defaultBrowser
		    }
		}
	});
	grunt.registerTask('default', function(){
		if(!grunt.file.isDir(config.dist))
			grunt.task.run(['build']);
		grunt.task.run(['connect','open','watch']);
	});
	grunt.registerTask('build', ['clean:build','includes','less','copy:build']);
	grunt.registerTask('imgmin', ['clean:images','imagemin']);
}