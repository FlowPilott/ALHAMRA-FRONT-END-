
import { Bars } from 'react-loader-spinner';


const Spinner = ({ visible = true, height = 30, width = 30, colors = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'] }) => {
    return (
        <Bars
            visible={visible}
            height={height}
            width={width}
            ariaLabel="vortex-loading"
            wrapperStyle={{ display: 'inline-block' }}
            wrapperClass="vortex-wrapper"
            color="white"
        />
    );
};

export default Spinner;
