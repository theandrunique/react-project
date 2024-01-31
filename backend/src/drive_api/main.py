import os
from typing import Annotated

from fastapi import (
    APIRouter,
    Depends,
    File,
    Path,
    UploadFile,
    HTTPException,
    status,
)
from fastapi.responses import FileResponse

from .utils import upload_file_to_dir

router = APIRouter(prefix="/file")


if not os.path.exists("files"):
    os.makedirs("files")


@router.post("/uploadfile/")
async def upload_file(
    file: Annotated[UploadFile, File()],
):
    await upload_file_to_dir(file=file)

    return {
        "url": f"http://localhost:8000/file/{file.filename}",
        "filename": file.filename,
        "type": file.content_type, 
    }


@router.get("/{file_name}/")
async def get_file(
    file_name: Annotated[str, Path],
):
    if not os.path.exists(f"./files/{file_name}"):
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="file not found",
        )

    return FileResponse(
        path=f"./files/{file_name}",
        filename=file_name,
    )


# @router.delete("/{file_id}", status_code=status.HTTP_204_NO_CONTENT)
# async def delete_file(
#     file_id: Annotated[str, Path],
#     session: AsyncSession = Depends(db_helper.scoped_session_dependency),
#     file_from_db: FileInDB = Depends(get_file_by_id),
# ):
#     if not os.path.exists(f"{settings.STORAGE_DIR_NAME}/{file_id}"):
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND, detail=f"file {file_id} not found"
#         )
#     await delete_field_from_db(session=session, file=file_from_db)
#     os.remove(f"{settings.STORAGE_DIR_NAME}/{file_id}")
