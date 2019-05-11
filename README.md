# Repo
This repo contains a few of my dots, the rest of this readme is more like a remider of the things the i usually need to setup my Arch OS.

## .bin
Scripts, right now just a screenshot script the runs scrot and send a notification using one of the /Imagens file.

## .config
dots, dunst, tint2,termite openbox folder and obmenu-generator is optional if you don't plan to use openbox.


# Arch Install steps (2019)


## Add user
useradd -m -g users -G wheel,storage,power,uucp -s /bin/bash rodrigo 
## uucp group for the prismatik use, optional if you dont plan to use it
passwd rodrigo

#setup the users with visudo 

## Setup basic (nvidia)
sudo pacman -S nvidia nvidia-utils nvidia-settings lib32-nvidia-utils git xorg xorg-xinit sddm openbox xterm termite firefox tint2 nitrogen geany pcmanfm lxappearance


## Once multilib is enabled
sudo pacman -Sy wine-staging giflib lib32-giflib libpng lib32-libpng libldap lib32-libldap gnutls lib32-gnutls mpg123 lib32-mpg123 openal lib32-openal v4l-utils lib32-v4l-utils libpulse lib32-libpulse libgpg-error lib32-libgpg-error alsa-plugins lib32-alsa-plugins alsa-lib lib32-alsa-lib libjpeg-turbo lib32-libjpeg-turbo sqlite lib32-sqlite libxcomposite lib32-libxcomposite libxinerama lib32-libxinerama ncurses lib32-ncurses opencl-icd-loader lib32-opencl-icd-loader libxslt lib32-libxslt libva lib32-libva gtk3 lib32-gtk3 gst-plugins-base-libs lib32-gst-plugins-base-libs vulkan-icd-loader lib32-vulkan-icd-loader cups samba
sudo pacman -S steam

## if steam has font issues
- cd ~/.fonts/ (create the folder if it doesn't exists - "mkdir .fonts")
- wget https://support.steampowered.com/downloads/1974-YFKL-4947/SteamFonts.zip
- unzip SteamFonts.zip && rm SteamFonts.zip  

## install yay 
git clone https://aur.archlinux.org/yay.git
cd yay
makepkg -si

## after yay setup discord, spotify, prismatik (backlight), openbox menu generator, themes, sddm themes, etc
yay -S prismatik nvida-beta discord spotify obmenu-generator numix-icon-theme-pack-git sddm-config-editor-git enlightenment-arc-theme grub2-theme-archlinux grub2-theme-archxion arc-gotham-gtk-theme-git arc-gtk-theme-git arc-icon-theme-git
