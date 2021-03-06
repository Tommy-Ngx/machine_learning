// @flow
import React from 'react';
import type { Node } from 'react';
import Box from '@material-ui/core/Box';

import type { Experiment } from '../types';
import cover from '../../../images/recipe_generation_rnn.jpg';
import {
  ML_EXPERIMENTS_DEMO_MODELS_PATH,
  ML_EXPERIMENTS_GITHUB_NOTEBOOKS_URL,
} from '../../../constants/links';
import TextGenerator from '../../shared/TextGenerator';
import modelVocabulary from './vocabulary';
import { experimentsSlugs } from '../types';

const experimentSlug = experimentsSlugs.RecipeGenerationRNN;
const experimentName = 'Recipe Generation (RNN)';
const experimentDescription = 'Generate a recipe with ingredients and cooking instructions using Recurrent Neural Network (RNN)';
const notebookUrl = `${ML_EXPERIMENTS_GITHUB_NOTEBOOKS_URL}/recipe_generation_rnn/recipe_generation_rnn.ipynb`;

const modelPath = `${ML_EXPERIMENTS_DEMO_MODELS_PATH}/recipe_generation_rnn/model.json`;

const RecipeGenerationRNN = (): Node => {
  const description = '';

  const stopSign = 'ā£';
  const stopWordTitle = 'š ';
  const stopWordIngredients = '\nš„\n\n';
  const stopWordInstructions = '\nš\n\n';

  const preProcessInput = (inputText: ?string): string => {
    let text = inputText || '';
    text = text.trim();
    if (text.length) {
      text = text[0].toUpperCase() + text.slice(1);
    }
    text = stopWordTitle + text;
    return text;
  };

  const removeDuplicateIngredients = (recipe: string): string => {
    const ingredientsSeparator = 'ā¢';

    return Object.keys(recipe
      .split(ingredientsSeparator)
      .reduce((map: Object, str: string) => {
        // eslint-disable-next-line no-param-reassign
        map[str] = true;
        return map;
      }, {}))
      .join(ingredientsSeparator);
  };

  const preProcessOutput = (generatedText: string): string => {
    let preProcessedText = removeDuplicateIngredients(generatedText);
    preProcessedText = preProcessedText.replace(new RegExp(stopSign, 'g'), '');
    preProcessedText = preProcessedText.replace(new RegExp(stopWordTitle), 'š [NAME]\n\n');
    preProcessedText = preProcessedText.replace(new RegExp(stopWordInstructions), '\nš [INSTRUCTIONS]\n\n');
    preProcessedText = preProcessedText.replace(new RegExp(stopWordIngredients), '\nš„ [INGREDIENTS]\n\n');
    return preProcessedText;
  };

  return (
    <Box>
      <p>
        Let Recurrent Neural Network generate a randomly weird recipe for you.
      </p>

      <Box mb={4}>
        <ul>
          <li>
            <span role="img" aria-label="Warning">ā ļø</span>
            ļø
            {' '}
            This is just for fun and not for cooking
          </li>
          <li>
            <span role="img" aria-label="Info">ā¹ļø</span>
            ļø
            {' '}
            You may leave recipe name blank. You may also try something like
            {' '}
            <i>Mushroom</i>
            ,
            {' '}
            <i>Sweet</i>
            {' '}
            etc.
          </li>
          <li>
            <span role="img" aria-label="Idea">š”</span>
            {' '}
            If recipe looks like a garbage, try different title start or fuzziness
          </li>
          <li>
            <span role="img" aria-label="Recipes">š„</span>
            {' '}
            If still no luck, check
            {' '}
            <a href="https://www.instagram.com/home_full_of_recipes/">real recipes here</a>
          </li>
        </ul>
      </Box>

      <TextGenerator
        modelPath={modelPath}
        modelVocabulary={modelVocabulary}
        preProcessOutput={preProcessOutput}
        preProcessInput={preProcessInput}
        description={description}
        defaultSequenceLength={800}
        defaultUnexpectedness={0.6}
        inputRequired={false}
        textLabel="Start recipe title"
        textHelper="Case-sensitive. Might be empty."
      />
    </Box>
  );
};

const experiment: Experiment = {
  slug: experimentSlug,
  name: experimentName,
  description: experimentDescription,
  component: RecipeGenerationRNN,
  notebookUrl,
  cover,
  inputTextExamples: ['Banana', 'Mushroom', 'Sweet', 'Orange', 'A', 'O', 'L', ''],
};

export default experiment;
