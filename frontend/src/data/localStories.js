import page1 from '../../../BB_story/1.jpg?url';
import page2 from '../../../BB_story/2.jpg?url';
import page3 from '../../../BB_story/3.jpg?url';
import page4 from '../../../BB_story/4.jpg?url';
import page5 from '../../../BB_story/5.jpg?url';
import page6 from '../../../BB_story/6.jpg?url';

/** Used when the API is unreachable (no MongoDB / no backend). IDs are stable for routing. */
export const LOCAL_STORIES = [
    {
        _id: 'local-bb-story',
        title: 'BB Story',
        summary:
            'A bright picture adventure—wonder what happens next in each scene? Tell it your own way, then celebrate together!',
        images: [page1, page2, page3, page4, page5, page6],
    },
];

export function getLocalStoryById(id) {
    return LOCAL_STORIES.find((s) => s._id === id) ?? null;
}
