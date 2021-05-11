import React, {Component} from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import Orientation from 'react-native-orientation-locker';
import Video from 'react-native-video';
import MediaControls, {PLAYER_STATES} from 'react-native-media-controls';
import CustomStatusBar from "../common/StatusBar";

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class VideoPlayer extends Component {
    videoPlayer;

    constructor(props) {
        super(props);
        this.state = {
            currentTime: 0,
            duration: 0,
            isFullScreen: false,
            isLoading: true,
            paused: false,
            playerState: PLAYER_STATES.PLAYING,
            screenType: 'contain',
            videoLandscape: false,
            orientation: 'PORTRAIT'
        };
    }

    _orientationDidChange = (orientation) => {
        if (orientation === 'LANDSCAPE') {
            this.setState({
                isFullScreen: true,
                orientation: orientation
            });
        } else {
            this.setState({
                isFullScreen: false,
                orientation: orientation
            });
        }
    };

    componentDidMount() {
        Orientation.unlockAllOrientations();
        Orientation.addOrientationListener(this._orientationDidChange);
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        Orientation.removeOrientationListener(this._orientationDidChange);
    }


    onSeek = seek => {
        this.videoPlayer.seek(seek);
    };
    onPaused = playerState => {
        this.setState({
            paused: !this.state.paused,
            playerState,
        });
    };
    onReplay = () => {
        this.setState({playerState: PLAYER_STATES.PLAYING});
        this.videoPlayer.seek(0);
    };
    onProgress = data => {
        const {isLoading, playerState} = this.state;
        // Video Player will continue progress even if the video already ended
        if (!isLoading && playerState !== PLAYER_STATES.ENDED) {
            this.setState({currentTime: data.currentTime});
        }
    };

    onLoad = data => {
        const {naturalSize} = data
        const {orientation} = naturalSize
        this.setState({
            videoLandscape: orientation === 'landscape'
        })

        this.setState({duration: data.duration, isLoading: false});
    }
    onLoadStart = data => this.setState({isLoading: true});
    onEnd = () => this.setState({playerState: PLAYER_STATES.ENDED});
    onError = (error) => alert('Oh! ', error);

    renderToolbar = () => (
        <View>
            <Text> toolbar </Text>
        </View>
    );

    onSeeking = currentTime => this.setState({currentTime});

     getWithVideo = () => {
         if(this.state.videoLandscape) return height/width
         if(this.state.orientation === 'LANDSCAPE' ||
             this.state.orientation === 'LANDSCAPE-LEFT'||
             this.state.orientation === 'LANDSCAPE-RIGHT') return height/width
         return width/height
     }
    render() {
        const {url, name} = this.props.route.params;
        return (
            <View style={styles.container}>
                <CustomStatusBar/>
                <View style={styles.mediaPlayerContainer}>
                    <Video
                        onEnd={this.onEnd}
                        onError={this.onError}
                        onLoad={this.onLoad}
                        onLoadStart={this.onLoadStart}
                        onProgress={this.onProgress}
                        paused={this.state.paused}
                        ref={videoPlayer => (this.videoPlayer = videoPlayer)}
                        resizeMode={this.state.screenType}
                        onFullScreen={this.state.isFullScreen}
                        source={{uri: url}}
                        style={{
                            aspectRatio: this.getWithVideo(),
                            width: "100%"
                        }}
                        volume={10}
                    />
                </View>
                <MediaControls
                    duration={this.state.duration}
                    isLoading={this.state.isLoading}
                    mainColor="#333"
                    onPaused={this.onPaused}
                    onReplay={this.onReplay}
                    onSeek={this.onSeek}
                    onSeeking={this.onSeeking}
                    playerState={this.state.playerState}
                    progress={this.state.currentTime}
                    toolbar={this.renderToolbar()}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    toolbar: {
        marginTop: 30,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    mediaPlayerContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        backgroundColor: 'black',
    },
});
export default VideoPlayer;
