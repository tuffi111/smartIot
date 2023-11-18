#!/bin/bash

# proxy for vagrant
#echo "cd code && $@"
vagrant ssh -c "cd code && $@"
