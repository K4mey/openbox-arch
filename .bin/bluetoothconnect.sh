var=$(hcitool lq 50:E6:66:9C:BD:A5 | sed -n -e 's/^.*Link quality: //p')
num1=200
num2=$var

while [ $num1 -gt $var ]; do
	echo "lower signal"
	notify-send "Link Quality" "Low link quality, attempting to reconnect..."
	echo ${var}
	bluetoothctl disconnect 50:E6:66:9C:BD:A5
	echo "device has been reconnected"
	sleep 60s
done
while [ $var -gt $num1 ]; do
        echo "good signal"
        notify-send "Link Quality" "High link quality"
	echo ${var}
	sleep 60s
done

