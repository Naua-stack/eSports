import {
  SafeAreaView,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Text,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { Background } from "../../components/Background";
import { Entypo } from "@expo/vector-icons";
import { styles } from "./styles";
import { GameParams } from "../../@types/@navigation";
import { THEME } from "../../theme";
import logoImg from "../../assets/logo-nlw-esports.png";
import { Heading } from "../../components/Heading";
import { useNavigation } from "@react-navigation/native";
import { DuoCard, DuoCardProps } from "../../components/DuoCard";
import { useEffect, useState } from "react";
import { DuoMatch } from "../../components/DuoMatch";

interface RouteParams {
  id: string;
  title: string;
  bannerUrl: string;
}

export function Game() {
  const route = useRoute();
  const navigation = useNavigation();

  const game = route.params as GameParams;

  const [duos, setDuos] = useState<DuoCardProps[]>([]);
  const [discordDuoSelected, setDiscordDuoSelected] = useState<string>("");

  function handleGoBack() {
    navigation.goBack();
  }

  async function getDiscordUser(adsId: string) {
    fetch(`http://192.168.1.103:3333/ads/${adsId}/discord`)
      .then((res) => res.json())
      .then((data) => setDiscordDuoSelected(data));
  }

  useEffect(() => {
    fetch(`http://192.168.1.103:3333/games/${game.id}/ads`)
      .then((res) => res.json())
      .then((data) => setDuos(data));
  }, []);

  return (
    <Background>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Entypo
              name="chevron-thin-left"
              color={THEME.COLORS.CAPTION_300}
              size={20}
            />
          </TouchableOpacity>

          <Image source={logoImg} style={styles.logo} />

          <View style={styles.right} />
        </View>

        <Image
          source={{ uri: game.bannerUrl }}
          style={styles.cover}
          resizeMode="cover"
        />
        <Heading title={game.title} subtitle="Conecte-se e comece a jogar!" />

        <FlatList
          data={duos}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.containerList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DuoCard data={item} onConnect={() => getDiscordUser(item.id)} />
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>
              Não há anúncios publicados ainda.
            </Text>
          )}
          contentContainerStyle={[
            duos.length > 0 ? styles.contentList : styles.emptyListContent,
          ]}
        />

        <DuoMatch
          visible={!!discordDuoSelected}
          onClose={() => setDiscordDuoSelected("")}
          discord={discordDuoSelected}
        />
      </SafeAreaView>
    </Background>
  );
}
