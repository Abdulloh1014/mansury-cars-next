import React, { useEffect, useState } from 'react';
import '@toast-ui/editor/dist/toastui-editor.css';
import { Viewer } from '@toast-ui/react-editor';
import { Box, Stack, CircularProgress } from '@mui/material';

const TViewer = (props: any) => {
    const [editorLoaded, setEditorLoaded] = useState(false);

    useEffect(() => {
        if (props.markdown) {
            setEditorLoaded(true);
        } else {
            setEditorLoaded(false);
        }
    }, [props.markdown]);

    return (
        <Stack sx={{ background: 'transparent' }}>
            <Box
                component={'div'}
                sx={{
                    '& .toastui-editor-contents': {
                        background: 'transparent !important',
                    },
                    '& .toastui-editor-contents p': {
                        color: '#ffffff !important',
                        fontSize: '16px !important',
                        lineHeight: '1.8 !important',
                    },
                    '& .toastui-editor-contents h1, & .toastui-editor-contents h2, & .toastui-editor-contents h3': {
                        color: '#ffffff !important',
                    },
                    '& .toastui-editor-contents li, & .toastui-editor-contents ul, & .toastui-editor-contents ol': {
                        color: '#ffffff !important',
                    },
                    '& .toastui-editor-contents strong, & .toastui-editor-contents em': {
                        color: '#ffffff !important',
                    },
                    '& .toastui-editor-contents *': {
                        background: 'transparent !important',
                        backgroundColor: 'transparent !important',
                    },
                    '& .toastui-editor-contents img': {
            display: 'none !important',
        },
                }}
            >
                {editorLoaded ? (
                    <Viewer
                        initialValue={props.markdown}
                        customHTMLRenderer={{
                            htmlBlock: {
                                iframe(node: any) {
                                    return [
                                        {
                                            type: 'openTag',
                                            tagName: 'iframe',
                                            outerNewLine: true,
                                            attributes: node.attrs,
                                        },
                                        { type: 'html', content: node.childrenHTML ?? '' },
                                        { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
                                    ];
                                },
                                div(node: any) {
                                    return [
                                        { type: 'openTag', tagName: 'div', outerNewLine: true, attributes: node.attrs },
                                        { type: 'html', content: node.childrenHTML ?? '' },
                                        { type: 'closeTag', tagName: 'div', outerNewLine: true },
                                    ];
                                },
                            },
                            htmlInline: {
                                big(node: any, { entering }: any) {
                                    return entering
                                        ? { type: 'openTag', tagName: 'big', attributes: node.attrs }
                                        : { type: 'closeTag', tagName: 'big' };
                                },
                            },
                        }}
                    />
                ) : (
                    <CircularProgress />
                )}
            </Box>
        </Stack>
    );
};

export default TViewer;
