#!/bin/bash

if [ $(whoami) != 'root' ]; then
  echo "Please sudo this script (don't run it as root directly!)"
	exit 1
fi

systemctl stop agilebored.service

sudo --set-home --preserve-env --user=board ./update-prod.sh
exit_status=$?
if [ $exit_status -ne 0 ]; then
	exit $exit_status
fi

systemctl start agilebored.service
