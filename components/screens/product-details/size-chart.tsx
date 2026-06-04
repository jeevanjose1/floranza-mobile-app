import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
  product: any;
};

export default function SizeChart({ product }: Props) {
  const [visible, setVisible] = useState(false);

  const { head, rows } = useMemo(() => {
    try {
      const table_data = JSON.parse(product?.size_chart?.jsonData) || [];
      return {
        head: (table_data?.[0] as string[]) || [],
        rows: (table_data?.slice(1) as string[][]) || [],
      };
    } catch {
      return { head: [], rows: [] };
    }
  }, [product?.size_chart?.jsonData]);

  // Don't render anything if there's no size chart data
  if (!head.length) return null;

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Text className="text-sm text-primary font-sam-medium">Size Guide</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-2xl max-h-[70%]">
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-200">
              <Text className="text-lg font-sam-bold text-gray-900">
                Size Chart
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                className="w-8 h-8 items-center justify-center rounded-full bg-gray-100"
              >
                <Ionicons name="close" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Table */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="px-4"
            >
              <ScrollView showsVerticalScrollIndicator className="pb-6 pt-2">
                {/* Table Header */}
                <View className="flex-row bg-gray-100 rounded-t-lg">
                  {head.map((item, index) => (
                    <View
                      key={index}
                      className="px-4 py-3"
                      style={{ minWidth: 90 }}
                    >
                      <Text className="font-sam-bold text-xs text-gray-700 uppercase">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Table Rows */}
                {rows.map((row, rowIndex) => (
                  <View
                    key={rowIndex}
                    className={`flex-row ${
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } ${
                      rowIndex === rows.length - 1 ? "rounded-b-lg" : ""
                    } border-b border-gray-100`}
                  >
                    {row.map((cell, cellIndex) => (
                      <View
                        key={`${rowIndex}-${cellIndex}`}
                        className="px-4 py-3"
                        style={{ minWidth: 90 }}
                      >
                        <Text
                          className={`text-xs ${
                            cellIndex === 0
                              ? "font-sam-bold text-gray-800"
                              : "font-sam text-gray-600"
                          }`}
                        >
                          {cell}
                        </Text>
                      </View>
                    ))}
                  </View>
                ))}
              </ScrollView>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
