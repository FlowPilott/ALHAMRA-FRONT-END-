import React from "react";
import { FixedSizeList as List } from "react-window";

interface CustomMenuListProps {
  children: React.ReactNode[];
  maxHeight: number;
  hasMoreData: boolean;
  fetchOptions: (append: boolean) => void;
}

const CustomMenuList: React.FC<CustomMenuListProps> = ({
  children,
  maxHeight,
  hasMoreData,
  fetchOptions,
}) => {
  const itemSize = 35;
  const itemCount = children.length;

  const handleItemsRendered = ({ visibleStopIndex }: { visibleStopIndex: number }) => {
    if (hasMoreData && visibleStopIndex >= itemCount - 1) {
      fetchOptions(true);
    }
  };

  return (
    <List
      height={maxHeight}
      itemCount={itemCount}
      itemSize={itemSize}
      width="100%"
      onItemsRendered={handleItemsRendered}
    >
      {({ index, style }) => (
        <div style={style}>
          {children[index]}
        </div>
      )}
    </List>
  );
};

export default CustomMenuList;
