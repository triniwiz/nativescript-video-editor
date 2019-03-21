import * as observable from 'tns-core-modules/data/observable';
import * as pages from 'tns-core-modules/ui/page';
import { HelloWorldModel } from './main-view-model';
import * as fs from 'tns-core-modules/file-system';
import { VideoEditor } from 'nativescript-video-editor';
import * as settings from 'tns-core-modules/application-settings';
// Event handler for Page 'loaded' event attached in main-page.xml
let vm;

export function pageLoaded(args: observable.EventData) {
    // Get the event sender
    let page = <pages.Page>args.object;
    vm = new HelloWorldModel();
    page.bindingContext = vm;
}


export function convertToMp4() {
    const file = fs.path.join(fs.knownFolders.currentApp().path, 'assets/ForBiggerJoyrides.mp4');
    const newPath = fs.path.join(fs.knownFolders.documents().path, 'assets');
    fs.Folder.fromPath(newPath); // creates new directory;
    const newFile = settings.getString('video', '');
    const newImage = settings.getString('image', '');
    console.log('newFile', newFile);
    if (fs.File.exists(newFile)) {
        console.log('oldFile size', fs.File.fromPath(file).size, 'newFile size', fs.File.fromPath(newFile).size);
        vm.set('src', newFile);
        getFileInfo(newFile);
        if (!newImage) {
            createThumb(newFile);
        } else {
            vm.set('image', newImage);
        }
    } else {
        VideoEditor.transcodeVideo(file, 'BigBuckBunny', 1000 * 1000, 15, 640, 480, false, (progress) => {
            console.log('transcodeVideo progress ', progress);
            vm.set('progress', Math.floor(Math.round(progress * 100)));
        }).then(done => {
            createThumb(done);
            console.dir('success', done);
            vm.set('src', done);
            settings.setString('video', done);
            getFileInfo(done);
        }).catch(error => {
            console.error(error);
        });
    }
}

function createThumb(file) {
    VideoEditor.createThumbnail(file, 'BigBuckBunny', 10, 300, 300, 100).then(photo => {
        vm.set('image', photo);
        console.log('createThumbnail', photo);
        settings.setString('image', photo);
    }).catch(e => {
        console.error('createThumbnail', e);
    });
}

export function getFileInfo(file) {
    VideoEditor.getVideoInfo(file)
        .then(info => {
            console.log(info);
        })
        .catch(error => {
            console.error(error.message);
        });
}
