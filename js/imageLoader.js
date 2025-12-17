export const images = {
    startSceneElement: new Image(),
    endSceneElement: new Image(),
    bgElement1: new Image(),
    bgElement2: new Image(),
    sonic: new Image(),
    sonunuNormal: new Image(),
    sonunuRun: new Image(),
    sonunuRunStar: new Image(),
    monster: new Image(),
    iceBullet: new Image(),
    iceCube1: new Image(),
    iceCube2: new Image(),
    iceCube3: new Image(),
    xmasTree: new Image(),
    xmasTreeComplete: new Image(),
    sonunuReward: new Image(),
    star: new Image()
};

images.sonic.src = 'assets/sonic.png';
images.startSceneElement.src = 'assets/start_scene_element.png';
images.endSceneElement.src = 'assets/end_scene_element.png';
images.bgElement1.src = 'assets/bg_element1.png';
images.bgElement2.src = 'assets/bg_element2.png';
images.sonunuNormal.src = 'assets/sonunu_normal.png';
images.sonunuRun.src = 'assets/sonunu_run.png';
images.sonunuRunStar.src = 'assets/sonunu_runStar.png';
images.monster.src = 'assets/monster.png';
images.iceBullet.src = 'assets/ice_bullet.png';
images.iceCube1.src = 'assets/ice_cube1.png';
images.iceCube2.src = 'assets/ice_cube2.png';
images.iceCube3.src = 'assets/ice_cube3.png';
images.xmasTree.src = 'assets/xmas_tree.png';
images.xmasTreeComplete.src = 'assets/xmas_tree_complete.png';
images.sonunuReward.src = 'assets/sonunu_reward.png';
images.star.src = 'assets/star.png';

export function loadAllImages(callback) {
    let imagesLoaded = 0;
    const totalImages = Object.keys(images).length;

    Object.values(images).forEach(img => {
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                callback();
            }
        };
    });
}