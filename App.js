import * as React from 'react';

import { StyleSheet, View, Text ,Button , DeviceEventEmitter, TextInput, Alert, Image} from 'react-native';
import ThalesPaysdkWrapper from 'react-native-thales-paysdk-wrapper';


export default function App() {
  const [cardPan, setCardPan] = React.useState("4413262938436808");
  const [cardExp, setCardExp] = React.useState("1225");
  const [cardCvv, setCardCvv] = React.useState("123");
  const [termsText, setTermsText] = React.useState(" ");
  const [jsonText, setJsonText] = React.useState("");
  const [encodedData, setEncodedData] = React.useState("iVBORw0KGgoAAAANSUhEUgAAADMAAAAzCAYAAAA6oTAqAAAAEXRFWHRTb2Z0d2FyZQBwbmdjcnVzaEB1SfMAAABQSURBVGje7dSxCQBACARB+2/ab8BEeQNhFi6WSYzYLYudDQYGBgYGBgYGBgYGBgYGBgZmcvDqYGBgmhivGQYGBgYGBgYGBgYGBgYGBgbmQw+P/eMrC5UTVAAAAABJRU5ErkJggg==");

   function enrollCard(cardPan,cardExp,cardCvv){

	ThalesPaysdkWrapper.enrollCard(cardPan,cardExp,cardCvv);
  }


 function acceptTerms(){
	ThalesPaysdkWrapper.proceedDigitize();
 }

 

  React.useEffect(() => {


	DeviceEventEmitter.addListener("CardEligibilityListener", (data) => {
		if(data.text){
			setTermsText(data.text);	
		}else{
			Alert.alert(data.error);	
		}
      //ThalesPaysdkWrapper.show(JSON.stringify(data.success))
	})

	DeviceEventEmitter.addListener("MGDigitizationListener", (data) => {
		if(data.digitalCardId){
			Alert.alert(data.digitalCardId);	
		}else{
			console.log(data.error);
			Alert.alert(data.error);	
		}
	})

	DeviceEventEmitter.addListener("ServerMessageListener", (data) => {
		 console.log(data.KnownMessageCode)
         if( data.KnownMessageCode == ThalesPaysdkWrapper.REQUEST_INSTALL_CARD){
			 console.log("new card install")
		 }

	})

  }, []);

  const loadCards =  async () => {
	try { 
	const result = await ThalesPaysdkWrapper.loadCards();
	console.log(result," Array from native side");
	} catch(err){
		Alert.alert(err.message);	
	}
 }

 const setDefaultCard = async () => {
	try { 
		const result = await ThalesPaysdkWrapper.setDefaultCardAction('2605983','ACTIVE');
		Alert.alert(result);
		} catch(err){
			Alert.alert(err.message);	
		} 
 }

 const deleteCard = async () => {
	try { 
		const result = await ThalesPaysdkWrapper.deleteCard("HCESDKVTS_-_K5BL8Hc8Lgq5kpEtf1cDGS0ez4bFdEQaPjI9-_-HCESANDBOX");
		Alert.alert(result);
		} catch(err){
			Alert.alert(err.message);	
		} 
 }

 const manageCard = async () => {
	try { 
		const result = await ThalesPaysdkWrapper.manageCard('HCESDKVTS_-_HIP1EWxSb3aMiKtwoP4i2gzpMRxJ445mKF07-_-HCESANDBOX',true);
		Alert.alert(result);
		} catch(err){
			Alert.alert(err.message);	
		} 
 }
  
 const initialiseSDK = async () => {
		ThalesPaysdkWrapper.initialiseSDK();	
 }

 const loadImage = async () => {
	try { 
		const result = await ThalesPaysdkWrapper.getCardImage('HCESDKVTS_-_BJelmOnzjhmUxDkK1NqHwDanmpdJP0WvkLo4-_-HCESANDBOX',ThalesPaysdkWrapper.CARD_BACKGROUND_COMBINED);
		console.log(result);
		setEncodedData(result)
		} catch(err){
			Alert.alert(err.message);	
		} 
 }
  

  return (
    <View style={styles.container}>
     {/* <Text>Result: {result}</Text>*/}

	 <Button onPress={() => enrollCard(cardPan,cardExp,cardCvv)} title="Enroll Card" />
     <Text />
	 <Text>{termsText}</Text>
	 <Text />
	 <Button onPress={() => acceptTerms()} title="Accept Terms" />
	 <Text />
	 <Button onPress={() => loadCards()} title="Load Cards" />
	 <Text>{jsonText}</Text>

	 <Button onPress={() => setDefaultCard()} title="SetDefaultCard" />
	 <Text />
	 <Button onPress={() => deleteCard()} title="Delete Card" />
	 <Text />
	 <Button onPress={() => manageCard()} title="Manage Card" />
	 <Text />
	 <Button onPress={() => initialiseSDK()} title="initialiseSDK" />

	 <Text />
	 <Button onPress={() => loadImage()} title="display Image" />

	 <Text />
	 <Image source={{uri: `data:image/png;base64,${encodedData}`}} />
	 <Text />

<Image
  style={{
    width: 250,
    height: 250,
    resizeMode: 'contain'
  }}
  source={{
    uri:
      `data:image/png;base64,${encodedData}`
  }}
/>

	 <Text>End</Text>

			   
	  {/* <Text></Text>
	  <TextInput 
               underlineColorAndroid = "transparent"
               placeholder = "Card Pan"
               placeholderTextColor = "gray"
               autoCapitalize = "none"
			   onChangeText={text => setCardPan(text)}
			   value={cardPan}
			   />
	 <TextInput 
               underlineColorAndroid = "transparent"
               placeholder = "Card Expire"
               placeholderTextColor = "gray"
               autoCapitalize = "none"
			   onChangeText={text => setCardExp(text)}
			   value={cardExp}
			   />		
	<TextInput 
               underlineColorAndroid = "transparent"
               placeholder = "Card CVV"
               placeholderTextColor = "gray"
               autoCapitalize = "none"
			   onChangeText={text => setCardCvv(text)}
			   value={cardCvv}
			   />				      

	 <Button onPress={() => enrollCard(cardPan,cardExp,cardCvv)} title="Enroll Card" />
     <Text />
	 <Text>{termsText}</Text>
	 <Text />
	 <Button onPress={() => acceptTerms()} title="Accept Terms" />
	 <Text />
	 <Button onPress={() => loadCards()} title="Load Cards" />*/}
	</View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
	margin : 20
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
