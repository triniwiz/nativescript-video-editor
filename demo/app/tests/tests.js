var VideoEditor = require("nativescript-video-editor").VideoEditor;
var videoEditor = new VideoEditor();

describe("greet function", function() {
    it("exists", function() {
        expect(videoEditor.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(videoEditor.greet()).toEqual("Hello, NS");
    });
});