while true
do
	var=$(hcitool lq 50:E6:66:9C:BD:A5 | sed -n -e 's/^.*Link quality: //p')
	num1=200
	num2=$var
	if (( $num2 < $num1 ))
	then 	
		echo ${var}
		echo "lower signal"
		notify-send "Link Quality" "Low link quality, attempting to reconnect..."
		bluetoothctl disconnect 50:E6:66:9C:BD:A5
        echo "device has been reconnected"
        sleep 60s
	else
	 echo "good signal" ${var}
	 sleep 60s
	fi
done
