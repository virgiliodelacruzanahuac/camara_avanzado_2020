import React,{useState,useEffect,useRef} from 'react';
import { Text, View, StyleSheet,SafeAreaView,TouchableOpacity,Image,Modal} from 'react-native';
import Constants from 'expo-constants';
import {Camera } from 'expo-camera'; 
import { AntDesign } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';

export default function App() {
  const [tipoCamara,settipoCamara]= useState(Camera.Constants.Type.back);
  const [tienePermiso,settienePermiso] = useState(null);
  const camRef = useRef(null);
  const [fotoCapturada,setfotoCapturada] = useState(null);
  const [open,setopen] = useState(false);
useEffect(()=>{
      (async ()=> {
        const {status} = await Camera.requestPermissionsAsync();
        settienePermiso(status==='granted');
      })();
      (async ()=> {
        const {status} = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        settienePermiso(status==='granted');
      })();

      },[]);

if(tienePermiso=== null)
{
  return <View/>;
}
if(tienePermiso=== false)
{
  return <Text>Permiso negado!</Text>;
}

async function tomarFoto()
{
if(camRef)
{
  const data = await camRef.current.takePictureAsync();
  console.log(data);
  setfotoCapturada(data.uri);
  //alert(data.uri);
  setopen(true);
}
}
async function checayguardaenalbum(myasset)
{
 // console.log(JSON.stringify(MediaLibrary.getAlbumAsync('expo_app_vdelacruzj')));
 const album = await MediaLibrary.getAlbumAsync('expo_app_vdelacruzj');
 console.log(JSON.stringify(album));
if(album===null)
{
      MediaLibrary.createAlbumAsync('expo_app_vdelacruzj', myasset)
      .then(() => {
        alert('Album creado y foto guardada')
      })
      .catch(error => {
        alert('error al crear el album-'+ error)
      });
}
else{
  MediaLibrary.addAssetsToAlbumAsync(myasset,album)
  .then(() => {
        alert('foto guardada en album existente')
      })
      .catch(error => {
        alert('error al guardar en album existente-' + error)
      });
}
}

async function guardarFoto()
{
{/*}
const asset = await MediaLibrary.createAssetAsync(fotoCapturada)
.then(()=>{
alert('guardado ok');
checayguardaenalbum(asset);
})
.catch(error=>{
console.log('error',error);
})
*/}
const asset = await MediaLibrary.createAssetAsync(fotoCapturada);
checayguardaenalbum(asset);

}
  return (
    <SafeAreaView style={styles.container}>
    <Camera
     style={{flex: 1}} 
       type={tipoCamara}
       ref = {camRef}
        >
       <View
        style ={{flex:1 ,backgroundColor:'transparent',flexDirection:'row'}}>
        <TouchableOpacity
        style={{position:'absolute',bottom:20 ,left: 20}}
        onPress ={() =>{
        settipoCamara(
          tipoCamara === Camera.Constants.Type.back ? Camera.Constants.Type.front :Camera.Constants.Type.back
        )
        }}
        >
       <Text style={{fontSize:20 ,marginTop:13, color:'#fff'}}> Cambiar camara</Text>
       </TouchableOpacity >
       </View>
       </Camera>
        <TouchableOpacity style={styles.btncamara} onPress={tomarFoto}>
         <AntDesign name="camerao" size={23} color="#fff" />
       </TouchableOpacity>
       {

         fotoCapturada &&
         <Modal
         animationType = "slide"
         transparent = {false}
         visible ={open}
         >
         <View style={{flex:1, justifyContent: 'center',alignItems:'center', margin:20}}>
         <View style={{margin :10, flexDirection:'row'}} >
         <TouchableOpacity style ={{margin:10}} onPress ={ ()=>setopen(false) }>
             <FontAwesome name="window-close" size={50} color ='red' />
          </TouchableOpacity>
              <TouchableOpacity style ={{margin:10}} onPress ={ guardarFoto }>
             <FontAwesome name="upload" size={50} color ='red' />
          </TouchableOpacity>
          </View>
          <Image style = {{width:'100%',height:300,borderRadius:20}} source ={{ uri: fotoCapturada}} />

          </View>
        </Modal>
         
       }
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    
  },
  btncamara:{
    justifyContent:'center',
    alignItems:'center',
    backgroundColor :'#121212',
    margin: 20,
    borderRadius: 10,
    height: 50
  }
});
