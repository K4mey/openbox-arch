#
# ~/.bashrc
#

# If not running interactively, don't do anything
[[ $- != *i* ]] && return

alias ls='ls --color=auto'
PS1='[\u@\h \W]\$ '

alias cputemp='/home/rodrigo/.bin/cputemps.sh'
alias cpuinfo='watch -n.1 "cat /proc/cpuinfo | grep \"^[c]pu MHz\""'
