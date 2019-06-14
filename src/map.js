function guideme_map() {
	if (firstLoad) return;
	window.getUserCurrentPosition = (id) => {
		if (navigator.geolocation) {
			navigator.geolocation.watchPosition(pos => {
				console.log(pos)
				let latLng = {lat: pos.coords.latitude, lng: pos.coords.longitude}
				if (map) map.setCenter(latLng);
				db.ref('position/'+id).update({geolocation: latLng})
			})
		}
		else {
			console.log('cannot get')
		}	
	}
		
	function handleLocationError(hasGEO, infoWindow, pos) {
		if (!infoWindow) {
			console.log('map not load')
			return
		}
		infoWindow.setPosition(pos);
		infoWindow.setContent(hasGEO ? 'Lỗi: không thể sử dụng GEOLOCATION.' : 'Lỗi: thiết bị này không hỗ trợ GEOLOCATION');
		infoWindow.open(map);
	}
	
	window.creatingScript = (cb) => {
		let script = document.createElement('script')
		db.ref("key").once("value", snap => {
			key = snap.val()
			script.src = "https://maps.googleapis.com/maps/api/js?key="+key+"&callback=initMap"
			document.body.append(script)
			script.onload = () => {
				cb()
			}
		})
	}
	
	window.initMap = () => {
		map = new google.maps.Map(xMap, {
			center: {lat: 10.035, lng: 105.775},
			zoom: 12,
		});
		infoWindow = new google.maps.InfoWindow
	
		window.showPos = (latLng, id) => {
			console.log(latLng)
			if (markers[id]) markers[id].setMap(null)
			let marker = new google.maps.Marker({
				position: latLng,
				map: map
			})
			markers[id] = marker
			markers[id].setMap(map);
			console.log("created" + id)
			marker.addListener('click', e => {
				console.log(e)
			})
		}
		console.log('map+infowindow init')
	}
}