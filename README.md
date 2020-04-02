
![Result](https://i.imgur.com/dSm5qBe.png)
![Result](https://i.imgur.com/1T2ZBq6.png)

# Repo
This repo contains a few of my dots, the rest of this readme is more like a remider of the things the i usually need to setup my Arch OS.

## .bin
Scripts, right now just a screenshot script the runs scrot and send a notification using one of the ~/Pictures/others/ file, xsetwacom.sh sets my Stylus area to the main screen .

## .config
dots, dunst, tint2,termite openbox folder and obmenu-generator is optional if you don't plan to use openbox.

# Arch After install (2020)

## Add user
useradd -m -g users -G wheel,storage,power,uucp -s /bin/bash rodrigo 

> uucp group for the prismatik use, optional if you dont plan to use it

passwd rodrigo

#setup the users with visudo 

## Setup basic (nvidia)
sudo pacman -S nvidia nvidia-utils nvidia-settings git xorg xorg-xinit sddm openbox xterm kitty firefox tint2 nitrogen geany pcmanfm lxappearance dunst scrot gimp dhcpcd git alsamixer alsa-utils pavucontrol pulseaudio-alsa


## Zen Linux
> Right now im using the Zen Linux build for AMD Zen processors, if you plan to run with nvidia you need to setup nvidia-dmks in order to work!



## Applets
sudo pacman -S volumeicon playerctrl bluez bluez-utils network-manager-applet

sudo systemctl enable bluetooth.service

## Fonts removed

It was easy to install them through just git and copy paste but would be better just install them via pacman or yay since they would be updated


## install yay 
- git clone https://aur.archlinux.org/yay.git
- cd yay
- makepkg -si

## after yay setup discord, spotify, prismatik (backlight), openbox menu generator, themes, sddm themes, etc
yay -S prismatik discord spotify obmenu-generator numix-icon-theme-pack-git sddm-config-editor-git enlightenment-arc-theme grub2-theme-archlinux grub2-theme-archxion arc-gotham-gtk-theme-git arc-gtk-theme-git arc-icon-theme-git xf86-input-wacom

## Make icons work on obmenugenerator
sudo pacman -S gtk2-perl 

## Use All cores to compile packages
edit /etc/makepkg.conf
MAKEFLAGS="-j16"

# Steam issue with fonts

- cd ~/.fonts/ (create the folder if it doesn't exists - "mkdir .fonts")
- wget https://support.steampowered.com/downloads/1974-YFKL-4947/SteamFonts.zip
- unzip SteamFonts.zip && rm SteamFonts.zip  

# Fix discord voice

sudo nano /etc/modprobe.d/sound.conf

# Change load-module module-udev-detect to:

load-module module-udev-detect tsched=0
