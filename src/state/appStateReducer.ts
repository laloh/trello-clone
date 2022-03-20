import { Action } from "./actions";
import { nanoid } from "nanoid";
import { findItemIndexByID, moveItem } from "../utils/arrayUtils";
import { DragItem } from "../DragItem";

export type Task = {
  id: string;
  text: string;
};

export type List = {
  id: string;
  text: string;
  tasks: Task[];
};

export type AppState = {
  lists: List[];
  draggedItem: DragItem | null;
};

// we renamed the sate into draft, so we know that we can mutate it.
export const appStateReducer = (
  draft: AppState,
  action: Action
): AppState | void => {
  switch (action.type) {
    case "ADD_LIST": {
      draft.lists.push({
        id: nanoid(),
        text: action.payload,
        tasks: [],
      });
      break;
    }
    case "ADD_TASK": {
      const { text, listId } = action.payload;
      const targetListIndex = findItemIndexByID(draft.lists, listId);

      draft.lists[targetListIndex].tasks.push({
        id: nanoid(),
        text,
      });
      break;
    }
    case "MOVE_LIST": {
      const { draggedId, hoverId } = action.payload;
      const dragIndex = findItemIndexByID(draft.lists, draggedId);
      const hoverIndex = findItemIndexByID(draft.lists, hoverId);
      draft.lists = moveItem(draft.lists, dragIndex, hoverIndex);
      break;
    }
    case "SET_DRAGGED_ITEM": {
      draft.draggedItem = action.payload;
      break;
    }
    case "MOVE_TASK": {
      const { draggedItemId, hoveredItemId, sourceColumnId, targetColumnId } =
        action.payload;
      const sourceListIndex = findItemIndexByID(draft.lists, sourceColumnId);
      const targetListIndex = findItemIndexByID(draft.lists, targetColumnId);
      const dragIndex = findItemIndexByID(
        draft.lists[sourceListIndex].tasks,
        draggedItemId
      );
      const hoverIndex = hoveredItemId
        ? findItemIndexByID(draft.lists[targetListIndex].tasks, hoveredItemId)
        : 0;
      const item = draft.lists[sourceListIndex].tasks[dragIndex];
      // Remove the task from the source list
      draft.lists[sourceListIndex].tasks.splice(dragIndex, 1);

      // Add the task to the target list
      draft.lists[targetListIndex].tasks.splice(hoverIndex, 0, item);

      break;
    }
    default: {
      // Return will be handled by ImmerJs automatically
      break;
    }
  }
};
