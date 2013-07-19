#!/bin/bash

MDM=$(which maildirmake.dovecot);

if [ ! -d $1  ] ; then

	
	exit 0;

else
	exit 1
fi

