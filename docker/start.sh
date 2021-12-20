#!/bin/bash

# copy the modules into the classpath
cp /sprout/modules/* /sprout/BOOT-INF/lib/

# start the sprout server
java ${JAVA_OPTS} -cp ${SPROUT_OTHER_CLASSES}:/sprout -Dserver.port=${PORT} org.springframework.boot.loader.JarLauncher