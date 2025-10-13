import { useWindowDimensions } from "react-native";

type Props = {breakPoint:number}

export default function useBreakPoints({breakPoint}: Props) {
      const { width } = useWindowDimensions();
      const isWidth = width < breakPoint;

      return {
        isWidth
      }
    
  
}