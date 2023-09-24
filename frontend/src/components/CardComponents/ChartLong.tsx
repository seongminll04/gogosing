import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { setModal, selectAlbum } from "../../../store/actions";
import { useDispatch, useSelector } from "react-redux";
import { AppState } from "../../../store/state";
const { width, height } = Dimensions.get("window");

interface AlbumProps {
  album: {
    id: number;
    title: string;
    singer: string;
    image: any;
    url: string;
    lyrics: string;
  };
}

const ChartLong: React.FC<AlbumProps> = ({ album }) => {
  const [liked, setLiked] = useState(false);
  const dispatch = useDispatch(); // 이 위치로 변경

  const handleAlbumClick = () => {
    dispatch(setModal("musicDetail")); // 모달 표시 액션
    dispatch(selectAlbum(album)); // 선택된 앨범 데이터 저장 액션
  };

  const selectedAlbum = useSelector((state: AppState) => state.album);

  return (
    <TouchableOpacity onPress={handleAlbumClick}>
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Image source={album.image} style={styles.image} />
          <View style={styles.musicInfo}>
            <Text style={[styles.text, styles.title]}>{album.title}</Text>
            <Text style={styles.text}>{album.singer}</Text>
          </View>
          <TouchableOpacity onPress={() => setLiked(!liked)}>
            {liked ? (
              <AntDesign name="heart" style={styles.icon} />
            ) : (
              <AntDesign name="hearto" style={styles.icon} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChartLong;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    width: "100%",
    height: height * 0.08,
    marginBottom: 10,
  },
  image: {
    width: "20%",
    height: "100%",
    marginLeft: 20,
    borderRadius: 5,
  },
  infoContainer: {
    flex: 1,
    height: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 20, // 오른쪽에서 하트 아이콘을 20만큼 떨어트리기 위한 여백
  },
  musicInfo: {
    flex: 1,
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    marginLeft: 15,
  },
  text: {
    fontSize: 16,
    marginTop: 5,
    overflow: "hidden",
    color: "white",
  },
  title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  icon: {
    fontSize: 24,
    color: "red",
  },
});
