import CardLong from "./CardLong";
import React, { useState, useRef, useEffect } from "react";
import styles from "./CardLongContainer.module.css";
import axiosInstance from "../../axiosinstance";
import axios from "axios";

interface AlbumProps {
  musicId:number;
  title:string;
  singer:string|null;
  songImg:string|null;
}
interface Props {
  albums : AlbumProps[];
  keyword:string;
  selectedValue:string;
}

const CardLongSearchContainer: React.FC<Props> = ({albums,keyword,selectedValue}) => {
  const [startY, setStartY] = useState(0);
  const [scrollTop, setscrollTop] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [likelist, setLikeList] = useState<number[]|null>(null);
  const [startX, setStartX] = useState(0);
  const [albumdata, setAlbumData] = useState<AlbumProps[]>([]);
  const [pluspage, setpluspage] = useState(true);
  const [searchpage, setSearchPage] = useState(2);

  useEffect(()=>{
    setAlbumData(albums)
    const AccessToken = localStorage.getItem('AccessToken')
    axiosInstance({
      method:'get',
      url:`${process.env.REACT_APP_API_URL}/music/like`,
      headers:{
        Authorization:`Bearer ${AccessToken}`
      }
    }).then(res=>{
      const likelists = res.data.map((item:{musicId:number,singer:string,songImg:string|null,title:string}) => item.musicId)
      setLikeList(likelists)
    }).catch(err=>{
      console.log(err)
    })
  },[albums])

  const handleStart = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    const y = "touches" in e ? e.touches[0].pageY : e.pageY;
    const x = "touches" in e ? e.touches[0].pageX : e.pageX; // X 축 시작 지점 추가

    if (containerRef.current) {
      setStartY(y);
      setStartX(x); // 저장
      setscrollTop(containerRef.current.scrollTop);
      setIsDragging(true);
    }
  };

  const handleMove = (
    e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>
  ) => {
    if (!isDragging || !containerRef.current) return;

    const currentY = "touches" in e ? e.touches[0].pageY : e.pageY;
    const currentX = "touches" in e ? e.touches[0].pageX : e.pageX;

    // 시작점과 현재 점 사이의 X, Y 차이 계산
    const diffX = Math.abs(currentX - startX);
    const diffY = Math.abs(currentY - startY);

    if (diffX > diffY) {
      return; // X축의 움직임이 더 클 경우 이벤트를 중지
    }

    // e.preventDefault();
    const walk = currentY - startY;
    containerRef.current.scrollTop = scrollTop - walk;

  };

  const handleEnd = () => {
    setIsDragging(false); 
    if (containerRef.current) {
      const isAtBottom = containerRef.current.scrollTop + containerRef.current.clientHeight >= containerRef.current.scrollHeight;
      if (isAtBottom && pluspage) {
        // 스크롤이 제일 하단에 도달했을 때 loading 함수를 호출합니다.
        const sel = selectedValue==='제목' ? 'title' : selectedValue==='가수' ? 'singer': 'lyric'
        axios({
          method:'get',
          url:`${process.env.REACT_APP_API_URL}/search/${sel}?page=${searchpage}&keyword=${keyword}`,
        }).then(res=>{
          if (res.data.length>0) {
            setAlbumData((prevAlbumData) => [...prevAlbumData, ...res.data]); // 이전 상태를 이용하여 업데이트
            setSearchPage((prevSearchPage) => prevSearchPage + 1); // 이전 상태를 이용하여 업데이트
          } else {
            setpluspage(false)
          }
        }).catch(err=>{
          setpluspage(false)
        })
      }
    }
  };
  /* onTouch 관련은 Mobile 환경에서 터치가 있을 때, onMouse는 Web 환경에서 Mobile 처럼 클릭하고 이동 할 때의 케이스 */
  return (
    <div
      className={styles.container}
      ref={containerRef}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      style={{ overflow:'auto'}}
    >
    {albumdata.map((album,index) => (
        <CardLong idx={index+1} album={album} like={likelist === null ? null : likelist.includes(album.musicId) ? true : false} />
      ))}
    </div>
  );
};

export default CardLongSearchContainer;
