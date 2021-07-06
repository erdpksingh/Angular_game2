import './Helper/Polyfill.js';
import 'babylonjs-loaders';
import { Babylon } from './Engine/Babylon.js';
import { GameControllerInstance as GameController } from './Gameplay/GameController.js';
import { Loading } from './Loading/Loading';
import { UserCredentialsLoading } from './Loading/UserCredentialsLoading.js';
import { ContentLoading } from './Loading/ContentLoading.js';
import { EngineLoading } from './Loading/EngineLoading';
import { UserDataLoading } from './Loading/UserDataLoading.js';
import { UrlParameterLoading } from './Loading/UrlParameterLoading';
import { ConfigLoading } from './Loading/ConfigLoading';
import { ScoringDataLoading } from './Loading/ScoringDataLoading.js';
import { LogoLoading } from './Loading/LogoLoading.js';
import { VariableParsing } from './Loading/VariableParsing.js';
import { AppIdLoading } from './Loading/AppIdLoading.js';
import { QuestionLoading } from './Loading/QuestionLoading.js';

FastClick.attach(document.body);

console.log("Combo Racer (v1.2.0) launched");

Babylon.setup();

let loading = new Loading();
//Settings
loading.add(UrlParameterLoading);
loading.add(ConfigLoading);

//Externals
loading.add(ScoringDataLoading);
loading.add(AppIdLoading);
loading.add(UserCredentialsLoading);
loading.add(UserDataLoading);
loading.add(ContentLoading);
loading.add(QuestionLoading);

//Content parsing
loading.add(VariableParsing);
loading.add(LogoLoading);

//System
loading.add(EngineLoading);
loading.start();

Babylon.scene.onBeforeRenderObservable.add(() => {
	if (!loading.done) loading.update(Babylon.engine.getDeltaTime());
	else GameController.update();
})