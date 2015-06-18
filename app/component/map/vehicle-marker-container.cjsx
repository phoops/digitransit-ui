React         = require 'react'
isBrowser     = window?
DynamicPopup  = if isBrowser then require './dynamic-popup' else null
RouteMarkerPopup = require './route-marker-popup'
Marker        = if isBrowser then require 'react-leaflet/lib/Marker' else null
L             = if isBrowser then require 'leaflet' else null
RealTimeInformationAction = require '../../action/real-time-client-action'
Icon          = require '../icon/icon'

class VehicleMarkerContainer extends React.Component
  @contextTypes:
    getStore: React.PropTypes.func.isRequired
    executeAction: React.PropTypes.func.isRequired
    router: React.PropTypes.func.isRequired

  @vehicleIcons: if !isBrowser then null else 
    bus: L.divIcon(html: React.renderToString(React.createElement(Icon, img: 'icon-icon_bus')), className: 'vehicle-icon')
    tram: L.divIcon(html: React.renderToString(React.createElement(Icon, img: 'icon-icon_tram')), className: 'vehicle-icon')
    rail: L.divIcon(html: React.renderToString(React.createElement(Icon, img: 'icon-icon_rail')), className: 'vehicle-icon')
    subway: L.divIcon(html: React.renderToString(React.createElement(Icon, img: 'icon-icon_subway')), className: 'vehicle-icon')
    ferry: L.divIcon(html: React.renderToString(React.createElement(Icon, img: 'icon-icon_ferry')), className: 'vehicle-icon')

  constructor: () ->
    @vehicles = {}

  componentWillMount: ->
    if @props.startRealTimeClient
      @context.executeAction RealTimeInformationAction.startRealTimeClient
    @context.getStore('RealTimeInformationStore').addChangeListener @onChange
    for id, message of @context.getStore('RealTimeInformationStore').vehicles
      @updateVehicle(id, message)

  componentWillUnmount: ->
    if @props.startRealTimeClient and @context.getStore('RealTimeInformationStore').addChangeListener.client
      @context.executeAction RealTimeInformationAction.stopRealTimeClient @context.getStore('RealTimeInformationStore').addChangeListener.client
    @context.getStore('RealTimeInformationStore').removeChangeListener @onChange

  onChange: (id) =>
    message = @context.getStore('RealTimeInformationStore').getVehicle(id)
    @updateVehicle(id, message)

  updateVehicle: (id, message) ->
    popup =
      <DynamicPopup options={{offset: [106, 3], closeButton:false, maxWidth:250, minWidth:250, className:"route-marker-popup"}}>
        <RouteMarkerPopup message={message} context={@context}/>
      </DynamicPopup>
    @vehicles[id] = <Marker map={@props.map} key={id} position={lat: message.lat, lng: message.long} icon={VehicleMarkerContainer.vehicleIcons[message.mode]}>{popup}</Marker>
    @forceUpdate()

  render: ->
    <div>{((val for key, val of @vehicles))}</div>

module.exports = VehicleMarkerContainer