import React, { Component } from 'react';
import { string, object, array, number, bool, any, func } from 'prop-types';
import config from '../../../config';

/* global google */
class Map extends Component {
    static defaultProps = {
      controls: false,
      zoom: 12,
      center: { lat: -33.8688, lng: 151.2093 },
      markers: [],
      routes: [],
      icon: 'https://i.imgur.com/unMXE8B.png',
      iconClick: 'https://i.imgur.com/XiZYxed.png',
      mapRouteIcon: 'https://i.imgur.com/Zyinht5.png',
      suppressMarkers: true,
      polygons: [],
      polylines: [],
      height: 300,
      width: 400,
    }

    static propTypes = {
      style: object,
      suppressMarkers: bool,
      controls: bool,
      zoom: number,
      maxZoom: number,
      center: any,
      markers: array,
      routes: array,
      polygons: array,
      polylines: array,
      icon: string,
      iconClick: string,
      lat: any,
      lng: any,
      onClick: func,
      mapRouteIcon: string,
      height: string, 
      width: string,

    }

    state = {
      error: null,
    };

    UNSAFE_componentWillMount() { 
      this.setupGoogleApi();
    }
    
    componentWillUnmount() {
      if ( this.map ) {
        this.map = null;
      }
    }

    setupGoogleApi = () => {
      const googleScript = document.getElementById( 'google-api' );

      if ( !googleScript ) {
        const script = document.createElement( 'script' );

        script.src =
          `https://maps.googleapis.com/maps/api/js?key=${config.google.apiKey}`;
  
        script.async = true;
        script.id = 'google-api';
        document.body.appendChild( script );
      }
    };

    setup = () => {
      if ( typeof google === 'object' ) {
        const { controls, zoom, maxZoom, markers, routes } = this.props;

        const geocoder = new google.maps.Geocoder();

        const newCenter = this.getLatLng();

        const mapOptions = {
          zoom,
          maxZoom: maxZoom,
          center: newCenter,
          disableDefaultUI: !controls,
          zoomControl: !controls,
          scrollwheel: false,
        };

        try {
          this.map = new google.maps.Map( this.mapRef, mapOptions );
          this.isError = false;

          const infowindow = new google.maps.InfoWindow({
            content: '',
          });

          if ( window.getScreenSize() === 'sm' ) this.map.setOptions({ gestureHandling: 'cooperative' });

          this.locations = [];

          const adjustMapBounds = () => {
            if ( this.map ) {
              setTimeout(() => {
                this.adjustBounds();
              }, 500 );
            }
          };

          this.checkAddressFormat( geocoder, newCenter, () => {
            let counterMarkers = 0;

            this.markers = [];

            markers.forEach( marker => {
              this.checkAddressFormat( geocoder, marker, ( markerCoords ) => {
                if ( markerCoords.lat && markerCoords.lng ) {
                  const map = this.map;

                  const newMarker = new google.maps.Marker({
                    position: {
                      lat: parseFloat( markerCoords.lat ),
                      lng: parseFloat( markerCoords.lng ),
                    },
                    zIndex: 100,
                    icon: this.props.icon,
                    map,
                  });

                  this.markers.push({
                    newMarker,
                  });

                  newMarker.addListener( 'click', () => {
                    infowindow.open( map, newMarker );
                    infowindow.setContent( marker.text );
                    this.handleMarkerClick( newMarker );

                    const infowindowButton = document.getElementById( 'map-infowindow' );

                    if ( infowindowButton != null ) {
                      infowindowButton.addEventListener( 'click', () => {
                        if ( this.props.onClick ) this.props.onClick( marker.code, marker.root );
                      });
                    }
                  });

                  this.locations.push( 
                    new google.maps.LatLng(
                      markerCoords.lat, 
                      markerCoords.lng 
                    )
                  );

                  if ( counterMarkers === markers.length - 1 ) {
                    if ( markers.length > 1 || routes && routes.length > 0 ) {
                      adjustMapBounds();
                    } else {
                      adjustMapBounds();
                      map.setZoom( 12 );
                    }
                  }

                  counterMarkers += 1;
                }
                else {
                  counterMarkers += 1;
                }
              });
            });

            let counterRoutes = 0;

            routes.forEach( route => {
              const map = this.map;

              this.checkAddressFormat( geocoder, route.origin, ( routeOriginCoords ) => {
                const newMarker = new google.maps.Marker({
                  position: {
                    lat: parseFloat( routeOriginCoords.lat ),
                    lng: parseFloat( routeOriginCoords.lng ),
                  },
                  zIndex: 100,
                  icon: this.props.mapRouteIcon,
                  map,
                });

                this.markers.push({
                  newMarker,
                });

                newMarker.addListener( 'click', () => {
                  infowindow.open( map, newMarker );
                  infowindow.setContent( route.origin );
                });

                const originCoords = new google.maps.LatLng(
                  routeOriginCoords.lat, routeOriginCoords.lng 
                );

                this.locations.push( originCoords );

                this.checkAddressFormat( geocoder, route.dest, ( routeDestCoords ) => {
                  const newMarker = new google.maps.Marker({
                    position: {
                      lat: parseFloat( routeDestCoords.lat ),
                      lng: parseFloat( routeDestCoords.lng ),
                    },
                    zIndex: 100,
                    icon: this.props.mapRouteIcon,
                    map,
                  });

                  this.markers.push({
                    newMarker,
                  });

                  newMarker.addListener( 'click', () => {
                    infowindow.open( map, newMarker );
                    infowindow.setContent( route.dest );
                  });

                  const destCoords = new google.maps.LatLng(
                    routeDestCoords.lat, routeDestCoords.lng 
                  );

                  this.locations.push( destCoords );
                  this.calcRoute( originCoords, destCoords, () => {
                    if ( counterRoutes === routes.length - 1 ) {
                      adjustMapBounds();
                    }

                    counterRoutes += 1;
                  });
                });
              });
            });
          });
        }
        catch ( error ) {
          this.isError = true;
          this.setAlert( 'Map could not be loaded. Please contact support.' );
        }
      }
    }

    getLatLng = () => {
      const { center, lat, lng } = this.props;

      let newLat = center.lat;
      let newLng = center.lng;

      if ( lat && lng ) {
        if ( typeof lat !== 'number' ) {
          const checkLat = parseFloat( lat );

          if ( typeof lng !== 'number' ) {
            const checkLng = parseFloat( lng );

            if ( Number.isInteger( checkLat ) && Number.isInteger( checkLng )) {
              newLat = parseFloat( checkLat );
              newLng = parseFloat( checkLng );
            }
          }
        }
      }

      return { lat: newLat, lng: newLng };
    }

    componentDidMount() {
      this.setup();
      this.drawPolygons();
      this.drawPolylines();
    }

    checkAddressFormat = ( geocoder, value, callback ) => {
      let address = value;

      if ( typeof address === 'string' || 
      ( typeof address === 'object' && 
        address.suburb != null && 
        address.suburb.length > 0 && 
        address.state != null && 
        address.suburb.length > 0 )
      ) {
        if ( typeof address === 'object' ) {
          address = `${address.suburb}, ${address.state}`;
        }

        geocoder.geocode({ address: address }, ( results, status ) => {
          if ( status === 'OK' && results.length > 0 ) {
            results.forEach( result => {
              if ( 
                result.formatted_address != null && 
                window.similarity( address, result.formatted_address ) 
                > 30 ) {
                let input = result.geometry.location.toString();

                input = input.substr( 1, input.length - 1 );

                const latlngStr = input.split( ',', 2 );

                if ( latlngStr.length === 2 ) {
                  const latlng = {
                    lat: parseFloat( latlngStr[0] ),
                    lng: parseFloat( latlngStr[1] ),
                  };

                  callback( latlng );

                  return;
                }
              }
            });
          }
          else {
            this.setAlert( 'Address not found' );
          }
        });
      }
      else if ( typeof address === 'object' && address.lat && address.lng ) {
        callback( address );

        return;
      }
      else {
        this.setAlert( 'Address not found' );
      }
    }

    calcRoute = ( originCoords, destCoords, callback ) => {
      const directionsService = new google.maps.DirectionsService();

      const { suppressMarkers } = this.props;

      const request = {
        origin: originCoords,
            // waypoints: waypointCoords
        destination: destCoords,
        travelMode: 'DRIVING',
      };

        // let directionsDisplay = new google.maps.DirectionsRenderer();
      const directionsDisplay = new google.maps.DirectionsRenderer(
        { suppressMarkers: suppressMarkers }
      );

      directionsDisplay.setMap( this.map );
      directionsService.route( request, ( response, status ) => {
        if ( status === 'OK' ) {
          directionsDisplay.setDirections( response );
        }

        callback();
      });
    }

    adjustBounds = () => {
      const bounds = new google.maps.LatLngBounds();

      if ( bounds && this.map && this.locations ) {
        this.locations.forEach( location => {
          bounds.extend( location );
        });
      }

        // Don't zoom in too far on only one marker
      if ( bounds.getNorthEast().equals( bounds.getSouthWest())) {
        const extendPoint1 = new google.maps.LatLng(
          bounds.getNorthEast().lat() +
          0.01, bounds.getNorthEast().lng() +
          0.01 
        );
        const extendPoint2 = new google.maps.LatLng(
          bounds.getNorthEast().lat() -
          0.01, bounds.getNorthEast().lng() - 
          0.01 
        );

        bounds.extend( extendPoint1 );
        bounds.extend( extendPoint2 );
      }

      this.map.fitBounds( bounds );
      this.map.panToBounds( bounds );
        // this.map.setZoom(this.props.zoom);
    }

    setAlert = ( text ) => {
      this.setState({
        error: text,
      });
    }

    handleMarkerClick = ( markerData ) => {
      this.markers.map( marker => {
        if ( marker && marker.newMarker ) {
          marker.newMarker.setIcon( this.props.icon );
        }
      });
      markerData.setIcon( this.props.iconClick );
    }

    drawPolygons = () => {
      const map = this.map;

      if ( map ) {
        const infoWindow = new google.maps.InfoWindow();

        const  showsContent = ( event )  => {
          infoWindow.setContent( this.text );
          infoWindow.setPosition( event.latLng );
          infoWindow.open( map );
        };

        const { polygons } = this.props;

        if ( polygons && polygons.length > 0 ) {
          polygons.forEach( polygon => {
                    /* polygon contains arrays of raw coordinates */
            const coordinates = [];

            polygon.coordinates.forEach( rawCoordinates => {
              const coord = new google.maps.LatLng(
                rawCoordinates[0], rawCoordinates[1] 
              );

              coordinates.push( coord );
            });

            if ( coordinates ) {
              var shape = new google.maps.Polygon({
                text: polygon.text,
                paths: coordinates,
                strokeColor: polygon.strokeColor || '#FF0000',
                strokeOpacity: polygon.strokeOpacity || 0.8,
                strokeWeight: polygon.strokeWeight || 2.0,
                fillColor: polygon.fillColor || '#FF0000',
                fillOpacity: polygon.fillOpacity || 0.35,
              });

              shape.setMap( map );
              shape.addListener( 'click', showsContent );
            }
          });
        }
      }
    }

    drawPolylines = () => {
      const map = this.map;

      if ( map ) {
        const { polylines } = this.props;

        if ( polylines && polylines.length > 0 ) {
          polylines.forEach( polyline => {
                    /* polyline contains arrays of raw coordinates */
            const coordinates = [];

            polyline.coordinates.forEach( rawCoordinates => {
              coordinates.push({
                lat: rawCoordinates[0],
                lng: rawCoordinates[1],
              });
            });
            if ( coordinates ) {
              var shape = new google.maps.Polyline({
                path: coordinates,
                strokeColor: polyline.strokeColor || '#FF0000',
                strokeOpacity: polyline.strokeOpacity || 0.8,
                strokeWeight: polyline.strokeWeight || 2.0,
                fillColor: polyline.fillColor || '#FF0000',
                fillOpacity: polyline.fillOpacity || 0.35,
              });

              shape.setMap( map );
            }
          });
        }
      }
    }

    render() {
      const { style } = this.props;
      const componentStyle = { ...style };
      const { height, width } = this.props;

      return (
        <div
          className="google-map"
          ref={div => this.mapRef = div}
          style={{ ...{ height, width }, ...componentStyle }}
        >
          {
                this.state.error ? (
                  <div className="map-display-error">
                    {this.state.error}
                  </div>
                ) : null
            }
        </div>
          
      );
    }
}

export default Map;
