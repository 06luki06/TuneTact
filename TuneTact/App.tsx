import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

export default function App() {
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [token, setToken] = useState('');
  const [artistName, setArtistName] = useState('');
  const [artistId, setArtistId] = useState('');
  const [trackId, setTrackId] = useState('');

  const getToken = async () => {
    const authOptions = {
      method: 'POST',
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(`${clientId}:${clientSecret}`),
      },
      data: 'grant_type=client_credentials',
    };

    try {
      const response = await axios(authOptions);
      console.log('Success:', response.data);
      setToken(response.data.access_token);
    } catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const getArtistId = async () => {
    const searchOptions = {
      method: 'GET',
      url: `https://api.spotify.com/v1/search?q=${artistName}&type=artist`,
      headers: {
        'Authorization': 'Bearer ' + token,
      }};

    try {
      const response = await axios(searchOptions);
      console.log('Success:', response.data);
      console.log('ArtistId:', response.data.artists.items[0].id);
      setArtistId(response.data.artists.items[0].id);
    }catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const getTracksByArtist = async () => {
    const tracksOptions = {
      method: 'GET',
      url: `https://api.spotify.com/v1/artists/${artistId}/top-tracks`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    };

    try {
      const response = await axios(tracksOptions);
      console.log('Success:', response.data);
    } catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error.message);
    }
  };

  const getDevices = async () => {
    const devicesOptions = {
      method: 'GET',
      url: `https://api.spotify.com/v1/me/player/devices`,
      headers: {
        'Authorization': 'Bearer ' + token,
      }
    };

    try {
      const response = await axios(devicesOptions);
      console.log('Success:', response.data);
    } catch (error: any) {
      console.error('Error:', error.response ? error.response.data : error.message)
    }
  };

  const playMostPopularTrack = async () => {
    const playOptions = {
      method: 'PUT',
      url: `https://api.spotify.com/v1/me/player/play`,
      headers: {
        'Authorization': 'Bearer ' + token,
      },
    }};

  return (
    <View style={styles.container}>
      <Text>Enter ClientId and ClientSecret</Text>
      
      <TextInput
        style={styles.textinput}
        placeholder="ClientId"
        value={clientId}
        onChangeText={text => setClientId(text)}
      />
      
      <TextInput
        style={styles.textinput}
        placeholder="ClientSecret"
        value={clientSecret}
        onChangeText={text => setClientSecret(text)}
        secureTextEntry={true}
      />

      <TextInput
        style={styles.textinput}
        placeholder="ArtistName"
        value={artistName}
        onChangeText={text => setArtistName(text)}
      />

      <Button title="Get Token" onPress={getToken} />
      <Button title="Get Artist Id" onPress={getArtistId} />
      <Button title="Get tracks" onPress={getTracksByArtist} />
      <Button title="Play" onPress={playMostPopularTrack} />
      <Button title="Get Devices" onPress={getDevices} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  textinput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '80%',
  },
});
