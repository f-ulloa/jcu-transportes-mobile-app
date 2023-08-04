import React, { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  View,
  TextInput,
  Text,
} from "react-native";
import { ListItem } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreen() {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/viajes")
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => console.error(error));
  }, []);

  return (
    <View>
      <FlatList
        keyExtractor={(item) => item.id.toString()}
        data={data}
        renderItem={({ item }) => (
          <ListItem bottomDivider>
            <ListItem.Content>
              <ListItem.Title>{item.dir_inicio}</ListItem.Title>
              <ListItem.Subtitle>{item.dir_destino}</ListItem.Subtitle>
              <Button
                title="Modificar"
                onPress={() => navigation.navigate("Details", { viaje: item })}
              />
            </ListItem.Content>
          </ListItem>
        )}
      />
    </View>
  );
}

function DetailsScreen({ route, navigation }) {
  const { viaje } = route.params;

  const [fecha, setFecha] = useState(viaje.fecha);
  const [horaLlegada, setHoraLlegada] = useState(viaje.hora_llegada);
  const [dirInicio, setDirInicio] = useState(viaje.dir_inicio);
  const [dirDestino, setDirDestino] = useState(viaje.dir_destino);

  const handleComprobante = () => {
    fetch(`http://localhost:3001/viajes/${viaje.id}/comprobante`, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        // Aquí puedes manejar la respuesta de la API.
        // Por ejemplo, puedes mostrar una alerta con el comprobante.
        Alert.alert("Comprobante", JSON.stringify(json));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSave = () => {
    fetch(`http://localhost:3001/viajes/${viaje.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fecha,
        hora_llegada: horaLlegada,
        dir_inicio: dirInicio,
        dir_destino: dirDestino,
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        // Aquí puedes manejar la respuesta de la API después de guardar los cambios.
        // Por ejemplo, puedes mostrar una alerta para confirmar que los cambios se guardaron.
        Alert.alert(
          "Cambios guardados",
          "Los cambios se han guardado exitosamente."
        );
        navigation.goBack(); // Esto regresa a la pantalla anterior.
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View>
      <Text>Fecha:</Text>
      <TextInput value={fecha} onChangeText={setFecha} />

      <Text>Hora de Llegada:</Text>
      <TextInput value={horaLlegada} onChangeText={setHoraLlegada} />

      <Text>Dirección de inicio:</Text>
      <TextInput value={dirInicio} onChangeText={setDirInicio} />

      <Text>Dirección de destino:</Text>
      <TextInput value={dirDestino} onChangeText={setDirDestino} />

      <Button title="Guardar Cambios" onPress={handleSave} />
      <Button title="Generar Comprobante" onPress={handleComprobante} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
